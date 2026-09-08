# TIBCO BPM Silent Installer

Run the TIBCO BPM silent installer on the local Linux server.
The script patches the silent response file with the given installation path,
runs the installer, and captures a full timestamped log to ~/tibco_install_logs/.

## Steps

1. Ask the user for the three required inputs if they were not supplied as arguments:

   - **Installation path** — the target directory on Linux where TIBCO will be installed
     (e.g. `/opt/tibco/bpme`)
   - **Silent file path** — the full path to the `.silent` response XML file on this Linux server
     (e.g. `/home/apandey1/bpme570v11/TIBCOUniversalInstaller-bpme_5.7.0.silent`)
   - **Installer directory** — the directory on this Linux server that contains the
     `TIBCOUniversalInstaller-lnx-x86-64.bin` binary
     (e.g. `/home/apandey1/bpme570v11`)

2. Confirm the values with the user before running:

   ```
   Installation Path : <value>
   Silent File       : <value>
   Installer Dir     : <value>
   ```

   Ask: "Ready to start the TIBCO installation with the above settings? [y/N]"
   Stop if the user says no.

3. Run the installer script using Bash:

   ```bash
   bash ./scripts/tibco_local_install.sh \
     --install-path  "<INSTALL_PATH>" \
     --silent-file   "<SILENT_FILE>" \
     --installer-dir "<INSTALLER_DIR>"
   ```

   The script will:
   - Patch the `<installLocation>` in the silent file
   - Create the installation directory
   - Run the TIBCO Universal Installer in silent mode
   - Write a full timestamped log to `~/tibco_install_logs/tibco_install_<timestamp>.log`

4. Report the outcome:

   - **On success** — show the install path and the log file location.
   - **On failure** — show the exit code, the log file location, and the last 30 lines
     of the log so the user can triage immediately.
     Ask whether they want to see the full log or re-run with different parameters.

## Notes

- This skill runs directly on the Linux server. Make sure you are connected via MobaXterm
  (or any SSH session) before invoking it.
- Logs are always written regardless of success or failure.
- The binary name `TIBCOUniversalInstaller-lnx-x86-64.bin` is fixed inside the script.
  If your binary has a different name, edit `INSTALLER_BIN` at the top of
  `scripts/tibco_local_install.sh`.