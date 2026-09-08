#!/bin/bash
# ============================================================
# TIBCO BPM Remote Installer Automation Script
# ============================================================
# Runs from Windows (Git Bash / WSL), SSHes into a Linux
# server, uploads the silent response file, and runs the
# TIBCO Universal Installer in silent mode.
#
# Usage:
#   ./scripts/tibco_install.sh \
#     --host    <linux_hostname_or_ip>        \
#     --user    <ssh_username>                \
#     --key     <path_to_ssh_private_key>     \
#     --install-path  <install_dir_on_linux>  \
#     --silent-file   <local_path_to_.silent> \
#     --installer-dir <dir_on_linux_with_.bin>
#
# Example:
#   ./scripts/tibco_install.sh \
#     --host          gasdbpmrhel8x01 \
#     --user          apandey1 \
#     --key           ~/.ssh/id_rsa \
#     --install-path  /opt/tibco/bpme \
#     --silent-file   ./TIBCOUniversalInstaller-bpme_5.7.0.silent \
#     --installer-dir /home/apandey1/bpme570v11
# ============================================================

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ── Fixed installer binary name ───────────────────────────────
INSTALLER_BIN="TIBCOUniversalInstaller-lnx-x86-64.bin"

# ── Defaults ──────────────────────────────────────────────────
SSH_HOST=""
SSH_USER=""
SSH_KEY=""
INSTALL_PATH=""
SILENT_FILE=""
INSTALLER_DIR=""
REMOTE_SILENT="/tmp/tibco_install_response.xml"

log_info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
log_ok()      { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*"; }

usage() {
  sed -n '5,20p' "$0"
  exit 1
}

# ── Parse arguments ───────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --host)          SSH_HOST="$2";        shift 2 ;;
    --user)          SSH_USER="$2";        shift 2 ;;
    --key)           SSH_KEY="$2";         shift 2 ;;
    --install-path)  INSTALL_PATH="$2";    shift 2 ;;
    --silent-file)   SILENT_FILE="$2";     shift 2 ;;
    --installer-dir) INSTALLER_DIR="$2";   shift 2 ;;
    -h|--help)       usage ;;
    *) log_error "Unknown option: $1"; usage ;;
  esac
done

# ── Validate required arguments ───────────────────────────────
MISSING=()
[[ -z "$SSH_HOST" ]]      && MISSING+=("--host")
[[ -z "$SSH_USER" ]]      && MISSING+=("--user")
[[ -z "$SSH_KEY" ]]       && MISSING+=("--key")
[[ -z "$INSTALL_PATH" ]]  && MISSING+=("--install-path")
[[ -z "$SILENT_FILE" ]]   && MISSING+=("--silent-file")
[[ -z "$INSTALLER_DIR" ]] && MISSING+=("--installer-dir")

if [[ ${#MISSING[@]} -gt 0 ]]; then
  log_error "Missing required arguments: ${MISSING[*]}"
  usage
fi

# ── Validate local files ──────────────────────────────────────
if [[ ! -f "$SSH_KEY" ]]; then
  log_error "SSH key not found: $SSH_KEY"
  exit 1
fi

if [[ ! -f "$SILENT_FILE" ]]; then
  log_error "Silent file not found: $SILENT_FILE"
  exit 1
fi

# ── Summary ───────────────────────────────────────────────────
echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}  TIBCO BPM Installation - Configuration  ${NC}"
echo -e "${CYAN}============================================${NC}"
echo -e "  Linux Host      : ${YELLOW}$SSH_HOST${NC}"
echo -e "  SSH User        : ${YELLOW}$SSH_USER${NC}"
echo -e "  SSH Key         : ${YELLOW}$SSH_KEY${NC}"
echo -e "  Install Path    : ${YELLOW}$INSTALL_PATH${NC}"
echo -e "  Silent File     : ${YELLOW}$SILENT_FILE${NC}"
echo -e "  Installer Dir   : ${YELLOW}$INSTALLER_DIR${NC}"
echo -e "  Installer Binary: ${YELLOW}$INSTALLER_BIN${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# ── Confirm before proceeding ─────────────────────────────────
read -rp "Proceed with installation? [y/N]: " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  log_warn "Installation cancelled by user."
  exit 0
fi

# ── SSH options ───────────────────────────────────────────────
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no -o BatchMode=yes"

# ── Step 1: Test SSH connectivity ─────────────────────────────
log_info "Testing SSH connection to $SSH_HOST ..."
if ! ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "echo connected" > /dev/null 2>&1; then
  log_error "Cannot connect to $SSH_HOST. Check host, user, and SSH key."
  exit 1
fi
log_ok "SSH connection successful."

# ── Step 2: Patch installation path in silent file ────────────
log_info "Patching installation path in silent file ..."
PATCHED_SILENT="/tmp/tibco_patched_$$.xml"
cp "$SILENT_FILE" "$PATCHED_SILENT"

# Replace the installLocation value in the XML (handles common TIBCO silent file formats)
sed -i "s|<installLocation>.*</installLocation>|<installLocation>$INSTALL_PATH</installLocation>|g" "$PATCHED_SILENT"
sed -i "s|<data key=\"installLocation\">.*</data>|<data key=\"installLocation\">$INSTALL_PATH</data>|g" "$PATCHED_SILENT"

log_ok "Silent file patched: install path set to $INSTALL_PATH"

# ── Step 3: Upload patched silent file to Linux ───────────────
log_info "Uploading silent file to $SSH_HOST:$REMOTE_SILENT ..."
if ! scp $SSH_OPTS "$PATCHED_SILENT" "$SSH_USER@$SSH_HOST:$REMOTE_SILENT"; then
  log_error "Failed to upload silent file."
  rm -f "$PATCHED_SILENT"
  exit 1
fi
rm -f "$PATCHED_SILENT"
log_ok "Silent file uploaded to $REMOTE_SILENT"

# ── Step 4: Verify installer binary exists on Linux ───────────
log_info "Checking installer binary on Linux ..."
if ! ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "[[ -f $INSTALLER_DIR/$INSTALLER_BIN ]]"; then
  log_error "Installer binary not found on Linux: $INSTALLER_DIR/$INSTALLER_BIN"
  exit 1
fi
log_ok "Installer binary found."

# ── Step 5: Create installation directory on Linux ────────────
log_info "Creating installation directory $INSTALL_PATH on Linux ..."
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "mkdir -p $INSTALL_PATH"
log_ok "Installation directory ready."

# ── Step 6: Run the installer ─────────────────────────────────
log_info "Starting TIBCO installation on $SSH_HOST ..."
echo ""

ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "
  set -e
  cd $INSTALLER_DIR
  chmod +x ./$INSTALLER_BIN
  echo '[INSTALL] Running: ./$INSTALLER_BIN -silent -V ResponseFile=$REMOTE_SILENT'
  ./$INSTALLER_BIN -silent -V ResponseFile=$REMOTE_SILENT
  EXIT_CODE=\$?
  rm -f $REMOTE_SILENT
  exit \$EXIT_CODE
"

INSTALL_STATUS=$?

echo ""
if [[ $INSTALL_STATUS -eq 0 ]]; then
  echo -e "${GREEN}============================================${NC}"
  echo -e "${GREEN}  Installation completed successfully!      ${NC}"
  echo -e "${GREEN}  Path: $INSTALL_PATH on $SSH_HOST         ${NC}"
  echo -e "${GREEN}============================================${NC}"
else
  echo -e "${RED}============================================${NC}"
  echo -e "${RED}  Installation FAILED (exit code: $INSTALL_STATUS) ${NC}"
  echo -e "${RED}  Check the installer logs on $SSH_HOST      ${NC}"
  echo -e "${RED}============================================${NC}"
  exit $INSTALL_STATUS
fi
