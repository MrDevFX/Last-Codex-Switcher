//! Machine-bound backup key storage helpers.

use anyhow::{Context, Result};

#[cfg(any(test, target_os = "macos", all(unix, not(target_os = "macos"))))]
use base64::{engine::general_purpose::STANDARD, Engine as _};
use rand::RngCore;

const BACKUP_KEY_TARGET: &str = "CodexSwitcher.FullBackupKey";
const BACKUP_KEY_ACCOUNT: &str = "codex-switcher";
#[cfg(not(windows))]
const BACKUP_KEY_LABEL: &str = "Codex Switcher Full Backup Key";
const BACKUP_KEY_BYTES: usize = 32;

pub fn get_or_create_full_backup_key() -> Result<Vec<u8>> {
    if let Some(existing) = get_test_backup_key()? {
        return Ok(existing);
    }

    if let Some(existing) = read_full_backup_key()? {
        return Ok(existing);
    }

    let mut key = vec![0u8; BACKUP_KEY_BYTES];
    rand::rng().fill_bytes(&mut key);
    write_full_backup_key(&key)?;
    Ok(key)
}

pub fn get_full_backup_key() -> Result<Vec<u8>> {
    if let Some(key) = get_test_backup_key()? {
        return Ok(key);
    }

    read_full_backup_key()?.ok_or_else(|| {
        anyhow::anyhow!(
            "This full backup was encrypted with a machine-bound key that is not available on this user profile. \
Restore it on the machine/profile that exported it, then re-export if you need a new local backup."
        )
    })
}

#[cfg(test)]
fn get_test_backup_key() -> Result<Option<Vec<u8>>> {
    let Some(encoded) = std::env::var("CODEX_SWITCHER_TEST_BACKUP_KEY").ok() else {
        return Ok(None);
    };

    let key = STANDARD
        .decode(encoded.trim())
        .context("Failed to decode CODEX_SWITCHER_TEST_BACKUP_KEY")?;
    Ok(Some(key))
}

#[cfg(not(test))]
fn get_test_backup_key() -> Result<Option<Vec<u8>>> {
    Ok(None)
}

#[cfg(windows)]
fn read_full_backup_key() -> Result<Option<Vec<u8>>> {
    use windows_sys::Win32::Security::Credentials::{
        CredFree, CredReadW, CREDENTIALW, CRED_TYPE_GENERIC,
    };

    let target = wide(BACKUP_KEY_TARGET);
    let mut credential: *mut CREDENTIALW = std::ptr::null_mut();
    let found = unsafe { CredReadW(target.as_ptr(), CRED_TYPE_GENERIC, 0, &mut credential) };

    if found == 0 {
        let error = std::io::Error::last_os_error();
        const ERROR_NOT_FOUND: i32 = 1168;
        if error.raw_os_error() == Some(ERROR_NOT_FOUND) {
            return Ok(None);
        }
        return Err(error)
            .with_context(|| "Failed to read backup key from Windows Credential Manager");
    }

    let bytes = unsafe {
        let blob = std::slice::from_raw_parts(
            (*credential).CredentialBlob,
            (*credential).CredentialBlobSize as usize,
        );
        blob.to_vec()
    };
    unsafe { CredFree(credential.cast()) };
    Ok(Some(bytes))
}

#[cfg(windows)]
fn write_full_backup_key(key: &[u8]) -> Result<()> {
    use windows_sys::Win32::Security::Credentials::{
        CredWriteW, CREDENTIALW, CRED_PERSIST_LOCAL_MACHINE, CRED_TYPE_GENERIC,
    };

    let mut target = wide(BACKUP_KEY_TARGET);
    let mut username = wide(BACKUP_KEY_ACCOUNT);
    let credential = CREDENTIALW {
        Flags: 0,
        Type: CRED_TYPE_GENERIC,
        TargetName: target.as_mut_ptr(),
        Comment: std::ptr::null_mut(),
        LastWritten: Default::default(),
        CredentialBlobSize: key.len() as u32,
        CredentialBlob: key.as_ptr().cast_mut(),
        Persist: CRED_PERSIST_LOCAL_MACHINE,
        AttributeCount: 0,
        Attributes: std::ptr::null_mut(),
        TargetAlias: std::ptr::null_mut(),
        UserName: username.as_mut_ptr(),
    };

    let wrote = unsafe { CredWriteW(&credential, 0) };
    if wrote == 0 {
        return Err(std::io::Error::last_os_error())
            .context("Failed to write backup key to Windows Credential Manager");
    }

    Ok(())
}

#[cfg(windows)]
fn wide(value: &str) -> Vec<u16> {
    use std::os::windows::ffi::OsStrExt;

    std::ffi::OsStr::new(value)
        .encode_wide()
        .chain(std::iter::once(0))
        .collect()
}

#[cfg(target_os = "macos")]
fn read_full_backup_key() -> Result<Option<Vec<u8>>> {
    use std::process::Command;

    let output = Command::new("security")
        .args([
            "find-generic-password",
            "-a",
            BACKUP_KEY_ACCOUNT,
            "-s",
            BACKUP_KEY_TARGET,
            "-w",
        ])
        .output()
        .map_err(map_keychain_helper_error("macOS keychain"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr).to_ascii_lowercase();
        if stderr.contains("could not be found") {
            return Ok(None);
        }
        anyhow::bail!(
            "Full backup key is unavailable from the macOS keychain: {}",
            String::from_utf8_lossy(&output.stderr).trim()
        );
    }

    let secret =
        String::from_utf8(output.stdout).context("macOS keychain returned invalid UTF-8")?;
    let bytes = STANDARD
        .decode(secret.trim())
        .context("Failed to decode full backup key from macOS keychain")?;
    Ok(Some(bytes))
}

#[cfg(target_os = "macos")]
fn write_full_backup_key(key: &[u8]) -> Result<()> {
    use std::process::Command;

    let encoded = STANDARD.encode(key);
    let output = Command::new("security")
        .args([
            "add-generic-password",
            "-a",
            BACKUP_KEY_ACCOUNT,
            "-s",
            BACKUP_KEY_TARGET,
            "-w",
            &encoded,
            "-U",
            "-l",
            BACKUP_KEY_LABEL,
        ])
        .output()
        .map_err(map_keychain_helper_error("macOS keychain"))?;

    if !output.status.success() {
        anyhow::bail!(
            "Failed to store the full backup key in the macOS keychain: {}",
            String::from_utf8_lossy(&output.stderr).trim()
        );
    }

    Ok(())
}

#[cfg(all(unix, not(target_os = "macos")))]
fn read_full_backup_key() -> Result<Option<Vec<u8>>> {
    use std::process::Command;

    let output = Command::new("secret-tool")
        .args([
            "lookup",
            "service",
            BACKUP_KEY_TARGET,
            "account",
            BACKUP_KEY_ACCOUNT,
        ])
        .output()
        .map_err(map_keychain_helper_error("Secret Service"))?;

    if !output.status.success() {
        return Ok(None);
    }

    let secret = String::from_utf8(output.stdout)
        .context("Secret Service key helper returned invalid UTF-8")?;
    let bytes = STANDARD
        .decode(secret.trim())
        .context("Failed to decode full backup key from Secret Service")?;
    Ok(Some(bytes))
}

#[cfg(all(unix, not(target_os = "macos")))]
fn write_full_backup_key(key: &[u8]) -> Result<()> {
    use std::io::Write;
    use std::process::{Command, Stdio};

    let encoded = STANDARD.encode(key);
    let mut child = Command::new("secret-tool")
        .args([
            "store",
            "--label",
            BACKUP_KEY_LABEL,
            "service",
            BACKUP_KEY_TARGET,
            "account",
            BACKUP_KEY_ACCOUNT,
        ])
        .stdin(Stdio::piped())
        .spawn()
        .map_err(map_keychain_helper_error("Secret Service"))?;

    let Some(stdin) = child.stdin.as_mut() else {
        anyhow::bail!("Failed to open stdin for Secret Service key helper");
    };
    stdin
        .write_all(encoded.as_bytes())
        .context("Failed to send backup key to Secret Service")?;

    let status = child
        .wait()
        .context("Failed to wait for Secret Service key helper")?;
    if !status.success() {
        anyhow::bail!(
            "Failed to store the full backup key in Secret Service. Install and unlock a Secret Service provider, or restore the backup on the original machine/profile."
        );
    }

    Ok(())
}

#[cfg(not(any(unix, windows)))]
fn read_full_backup_key() -> Result<Option<Vec<u8>>> {
    anyhow::bail!("Full encrypted backups are not supported on this platform yet");
}

#[cfg(not(any(unix, windows)))]
fn write_full_backup_key(_key: &[u8]) -> Result<()> {
    anyhow::bail!("Full encrypted backups are not supported on this platform yet");
}

#[cfg(any(target_os = "macos", all(unix, not(target_os = "macos"))))]
fn map_keychain_helper_error(
    keychain_name: &'static str,
) -> impl FnOnce(std::io::Error) -> anyhow::Error {
    move |error| {
        match error.kind() {
        std::io::ErrorKind::NotFound => anyhow::anyhow!(
            "{keychain_name} support is not available on this machine, so machine-bound full backups are unsupported here."
        ),
        _ => anyhow::Error::new(error)
            .context(format!("Failed to invoke the {keychain_name} helper")),
    }
    }
}
