---
name: mcp-setup
description: Install and configure MCP servers for data analysis
argument-hint: "[server-name]"
allowed-tools:
  - read
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

Help install and configure MCP servers for data analysis work.

## Prerequisites Check

Before installing any MCP server, verify:
- Node.js is installed (for npm-based servers): `node --version`
- Python 3.10+ is installed (for Python-based servers): `python --version`
- uv is installed (recommended for Python packages): `uv --version`
- gcloud CLI is installed (for BigQuery): `gcloud --version`

## MCP Server Installation Guide

### 1. PostgreSQL MCP Server (@microsoft/postgres-mcp)

**Installation:**
```bash
# No installation needed - runs via npx
npx -y @microsoft/postgres-mcp --help
```

**Setup Connection Profile:**
```bash
# Add a connection profile (password stored in OS keyring)
npx -y @microsoft/postgres-mcp connection add local "postgresql://user@localhost:5432/database"

# Set password securely
npx -y @microsoft/postgres-mcp connection set-password local

# List profiles
npx -y @microsoft/postgres-mcp connection list
```

**For Read-Only Access (Recommended for AI):**
```bash
# Create read-only profile
npx -y @microsoft/postgres-mcp connection add local-ro "postgresql://readonly_user@localhost:5432/database" --access-mode ro
```

**Configuration Already Added:**
The config is already in `mcp_config.json` - just restart your client.

**Troubleshooting:**
- If connection fails, verify database is accessible: `psql -h localhost -U user -d database`
- Check firewall rules allow connections
- Ensure database user has proper permissions

---

### 2. MCP Data Science (AstyanM/mcp-data-science)

**Installation:**
```bash
# Clone the repository
git clone https://github.com/AstyanM/mcp-data-science.git
cd mcp-data-science

# Install with pip
pip install -e .

# Or with uv (recommended)
uv pip install -e .
```

**Alternative - With Virtual Environment:**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install
pip install -e .
```

**Configuration Already Added:**
The config is already in `mcp_config.json` - just restart your client.

**Testing:**
```bash
# Test the server
python -m mcp_data_science

# Or use MCP Inspector
mcp dev src/mcp_data_science/server.py
```

**Troubleshooting:**
- If Python not found, install from python.org
- If pip fails, upgrade: `python -m pip install --upgrade pip`
- On Windows, ensure Python is in PATH
- Dependencies install automatically (scipy, scikit-learn, etc.)

---

### 3. LocalData MCP Server (ChrisGVE/localdata-mcp)

**Installation Option 1 - With uv (Recommended):**
```bash
# Install permanently
uv tool install localdata-mcp

# Test installation
localdata-mcp --version
```

**Installation Option 2 - Without Permanent Install:**
```bash
# Runs directly with uvx (no install needed)
uvx localdata-mcp
```

**First Run Note:**
- First run downloads ~200MB of data science dependencies
- If MCP client times out on first launch, reconnect - subsequent starts are immediate
- Dependencies are cached after first download

**Configuration Already Added:**
The config is already in `mcp_config.json` using `uvx` - no permanent install needed.

**Testing:**
```bash
# Test without permanent install
uvx localdata-mcp

# Or if installed permanently
localdata-mcp
```

**Troubleshooting:**
- If uv not found, install: `pip install uv` or from https://docs.astral.sh/uv/
- First-run timeout is normal - just reconnect
- Check Python 3.10+ is available
- Verify the command exists: `which localdata-mcp` or `where localdata-mcp` (Windows)

---

### 4. BigQuery MCP Server (@ergut/mcp-bigquery-server)

**Prerequisites:**
```bash
# Install Google Cloud CLI
# Download from: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth application-default login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

**IAM Permissions Required:**
- BigQuery User (`roles/bigquery.user`)
- BigQuery Data Viewer (`roles/bigquery.dataViewer`)
- MCP Tool User (`roles/mcp.toolUser`)

**Installation:**
```bash
# No installation needed - runs via npx
npx -y @ergut/mcp-bigquery-server --help
```

**Configuration Update Required:**
You MUST update your `mcp_config.json` to replace `"your-project-id"` with your actual Google Cloud project ID:

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": [
        "-y",
        "@ergut/mcp-bigquery-server",
        "--project-id",
        "YOUR_ACTUAL_PROJECT_ID"
      ]
    }
  }
}
```

**Testing:**
```bash
# Test with your project ID
npx -y @ergut/mcp-bigquery-server --project-id YOUR_PROJECT_ID
```

**Troubleshooting:**
- Ensure gcloud authentication is current: `gcloud auth application-default login`
- Verify project ID is correct
- Check IAM permissions in Google Cloud Console
- Ensure BigQuery API is enabled in your project

---

## Post-Installation Steps

### 1. Restart Your MCP Client
After updating `mcp_config.json`, restart your MCP client (Devin Desktop, Claude Desktop, etc.) for changes to take effect.

### 2. Verify Servers Are Available
Use the MCP client to list servers:
- Check if servers appear in the server list
- Try listing tools for each server

### 3. Test Each Server
For each installed server:
- List available tools
- Try a simple operation
- Verify no errors in logs

## Quick Start Workflow

### For PostgreSQL Users:
1. Install nothing (runs via npx)
2. Set up connection profile: `npx -y @microsoft/postgres-mcp connection add local "postgresql://user@localhost:5432/db"`
3. Set password: `npx -y @microsoft/postgres-mcp connection set-password local`
4. Restart client
5. Start querying

### For File-Based Analysis:
1. Install MCP Data Science: `git clone https://github.com/AstyanM/mcp-data-science.git && cd mcp-data-science && pip install -e .`
2. Restart client
3. Load CSV files and analyze

### For Multi-Source Analysis:
1. No install needed (uses uvx)
2. Restart client
3. Connect to databases/files and analyze

### For BigQuery Users:
1. Install gcloud CLI and authenticate
2. Update config with your project ID
3. Restart client
4. Query BigQuery

## Common Issues & Solutions

### "Command not found" Errors
- **Node.js/npm**: Install from nodejs.org
- **Python**: Install from python.org
- **uv**: Install with `pip install uv`
- **gcloud**: Install from cloud.google.com/sdk/docs/install

### Permission Errors
- Run installation commands with appropriate permissions
- On Windows, run terminal as Administrator if needed
- Check PATH environment variable

### Timeout on First Start
- LocalData MCP downloads ~200MB on first run - this is normal
- Just reconnect to the MCP client
- Subsequent starts will be instant

### Connection Failures
- Verify database credentials
- Check network connectivity
- Ensure database is running
- Review firewall rules

### Module Import Errors
- Ensure you're using the correct Python environment
- Activate virtual environment if using one
- Reinstall the package: `pip install -e .`

## Verification Checklist

After installation, verify:
- [ ] All prerequisite tools installed (Node.js, Python, uv, gcloud)
- [ ] MCP servers installed or configured
- [ ] Connection profiles set up (for PostgreSQL)
- [ ] Project ID configured (for BigQuery)
- [ ] MCP client restarted
- [ ] Servers appear in client UI
- [ ] Tools are accessible for each server
- [ ] Basic operations work without errors

Ask the user:
- Which MCP servers they want to install?
- What data sources they're working with?
- Any errors they're encountering during installation?
