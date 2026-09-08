#!/bin/bash
# ============================================================
# TIBCO BPM Local Installer Script
# ============================================================
# Run this script directly on the Linux server (e.g. via
# MobaXterm SSH session).  It patches the silent response
# file with the given installation path, runs the TIBCO
# Universal Installer in silent mode, and captures the full
# output to a timestamped log file.
#
# Usage:
#   ./tibco_local_install.sh \
#     --install-path  <target_install_directory>      \
#     --silent-file   <path_to_.silent_response_file> \
#     --installer-dir <directory_containing_.bin>
#
# Example:
#   ./tibco_local_install.sh \
#     --install-path  /opt/tibco/bpme \
#     --silent-file   /home/apandey1/bpme570v11/TIBCOUniversalInstaller-bpme_5.7.0.silent \
#     --installer-dir /home/apandey1/bpme570v11
#
# Logs are written to: ~/tibco_install_logs/tibco_install_<timestamp>.log
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
INSTALL_PATH=""
SILENT_FILE=""
INSTALLER_DIR=""

log_info()  { echo -e "${CYAN}[INFO]${NC}  $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

usage() {
  sed -n '5,22p' "$0"
  exit 1
}

# ── Parse arguments ───────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --install-path)  INSTALL_PATH="$2";  shift 2 ;;
    --silent-file)   SILENT_FILE="$2";   shift 2 ;;
    --installer-dir) INSTALLER_DIR="$2"; shift 2 ;;
    -h|--help)       usage ;;
    *) log_error "Unknown option: $1"; usage ;;
  esac
done

# ── Validate required arguments ───────────────────────────────
MISSING=()
[[ -z "$INSTALL_PATH" ]]  && MISSING+=("--install-path")
[[ -z "$SILENT_FILE" ]]   && MISSING+=("--silent-file")
[[ -z "$INSTALLER_DIR" ]] && MISSING+=("--installer-dir")

if [[ ${#MISSING[@]} -gt 0 ]]; then
  log_error "Missing required arguments: ${MISSING[*]}"
  usage
fi

# ── Validate files exist ──────────────────────────────────────
if [[ ! -f "$SILENT_FILE" ]]; then
  log_error "Silent file not found: $SILENT_FILE"
  exit 1
fi

if [[ ! -f "$INSTALLER_DIR/$INSTALLER_BIN" ]]; then
  log_error "Installer binary not found: $INSTALLER_DIR/$INSTALLER_BIN"
  exit 1
fi

# ── Set up log file ───────────────────────────────────────────
LOG_DIR="$HOME/tibco_install_logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOGFILE="$LOG_DIR/tibco_install_${TIMESTAMP}.log"

# Tee all stdout and stderr to the log file from this point on
exec > >(tee -a "$LOGFILE") 2>&1

# ── Summary ───────────────────────────────────────────────────
echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}  TIBCO BPM Installation - Configuration  ${NC}"
echo -e "${CYAN}============================================${NC}"
echo -e "  Install Path    : ${YELLOW}$INSTALL_PATH${NC}"
echo -e "  Silent File     : ${YELLOW}$SILENT_FILE${NC}"
echo -e "  Installer Dir   : ${YELLOW}$INSTALLER_DIR${NC}"
echo -e "  Installer Binary: ${YELLOW}$INSTALLER_BIN${NC}"
echo -e "  Log File        : ${YELLOW}$LOGFILE${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""
log_info "Session started: $(date)"

# ── Confirm before proceeding ─────────────────────────────────
# Read from /dev/tty so the prompt works even with stdout redirected to tee
echo -n "Proceed with installation? [y/N]: "
read -r CONFIRM < /dev/tty
echo "$CONFIRM"   # echo the answer into the log

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  log_warn "Installation cancelled by user."
  exit 0
fi

# ── Trap unexpected exits ─────────────────────────────────────
trap 'RC=$?; echo ""; log_error "Script terminated unexpectedly (exit code: $RC)"; log_error "Full log: $LOGFILE"; exit $RC' ERR

# ── Step 1: Patch installation path in silent file ────────────
log_info "Step 1/3 — Patching installation path in silent file ..."
PATCHED_SILENT="/tmp/tibco_patched_$$.xml"
cp "$SILENT_FILE" "$PATCHED_SILENT"

sed -i "s|<installLocation>.*</installLocation>|<installLocation>$INSTALL_PATH</installLocation>|g" "$PATCHED_SILENT"
sed -i "s|<data key=\"installLocation\">.*</data>|<data key=\"installLocation\">$INSTALL_PATH</data>|g" "$PATCHED_SILENT"

log_ok "Silent file patched — install path set to: $INSTALL_PATH"

# ── Step 2: Create installation directory ────────────────────
log_info "Step 2/3 — Creating installation directory: $INSTALL_PATH ..."
mkdir -p "$INSTALL_PATH"
log_ok "Directory ready."

# ── Step 3: Run the installer ─────────────────────────────────
log_info "Step 3/3 — Running TIBCO installer ..."
log_info "Command: $INSTALLER_DIR/$INSTALLER_BIN -silent -V ResponseFile=$PATCHED_SILENT"
echo ""

cd "$INSTALLER_DIR"
chmod +x "./$INSTALLER_BIN"

# Disable ERR trap around the installer so we capture the exit code ourselves
trap - ERR
"./$INSTALLER_BIN" -silent -V "ResponseFile=$PATCHED_SILENT"
INSTALL_STATUS=$?

rm -f "$PATCHED_SILENT"

echo ""
echo -e "  Finished: $(date)"

# ── Result ────────────────────────────────────────────────────
if [[ $INSTALL_STATUS -eq 0 ]]; then
  echo ""
  echo -e "${GREEN}============================================${NC}"
  echo -e "${GREEN}  Installation completed successfully!      ${NC}"
  echo -e "${GREEN}  Path : $INSTALL_PATH                      ${NC}"
  echo -e "${GREEN}  Log  : $LOGFILE                           ${NC}"
  echo -e "${GREEN}============================================${NC}"
else
  echo ""
  echo -e "${RED}============================================${NC}"
  echo -e "${RED}  Installation FAILED (exit code: $INSTALL_STATUS)  ${NC}"
  echo -e "${RED}  Log  : $LOGFILE                           ${NC}"
  echo -e "${RED}============================================${NC}"
  echo ""
  echo -e "${YELLOW}── Last 30 lines of log ─────────────────────${NC}"
  tail -30 "$LOGFILE"
  echo -e "${YELLOW}─────────────────────────────────────────────${NC}"
  echo ""
  log_error "Review the full log for details: $LOGFILE"
  exit $INSTALL_STATUS
fi