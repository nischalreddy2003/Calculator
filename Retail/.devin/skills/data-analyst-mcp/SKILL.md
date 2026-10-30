---
name: data-analyst-mcp
description: Guide data analysts (0-3 years experience) on choosing and using the best MCP servers
argument-hint: "[task|database-type]"
allowed-tools:
  - read
  - grep
  - glob
  - mcp_list_servers
  - mcp_list_tools
  - mcp_call_tool
triggers:
  - user
  - model
---

Help data analysts (0-3 years experience) choose and use the best MCP servers for their tasks.

## Recommended MCP Servers by Experience Level

### For Beginners (0-1 year experience)

**1. PostgreSQL MCP Server** - Best Starting Point
- When to use: Working with PostgreSQL databases, learning SQL
- Use cases:
  - Generate SQL queries from natural language
  - Explain complex queries in plain English
  - Optimize slow queries
  - Understand database schema
- Safety tip: Always connect with read-only database user
- Learning curve: Low - standard SQL

**2. MCP Data Science (AstyanM)** - Best for Learning Pipelines
- When to use: Complete data science workflow (CSV files, local analysis)
- Features: 102 tools for loading, cleaning, transforming, visualizing, analyzing, modeling
- Built-in guidance: 13-phase pipeline with decision frameworks
- Covers: CSV, Excel, Parquet files, statistical tests, ML models
- Learning curve: Medium - but excellent for learning best practices

### For Intermediate (1-2 years experience)

**3. LocalData MCP Server** - Best for Versatility
- When to use: Multiple data sources, mixed file types and databases
- Features: 70 tools across 13 database types + 20+ file formats
- Databases: PostgreSQL, MySQL, SQLite, SQL Server, Oracle, BigQuery, Snowflake, etc.
- Files: CSV, Excel, JSON, Parquet, Avro, and more
- Data science tools: Statistical analysis, regression, clustering, time series, anomaly detection
- Safety: Memory-bounded streaming for large datasets
- Learning curve: Medium - covers everything

**4. BigQuery MCP Server** - Best for Cloud Analytics
- When to use: Google Cloud environment, large-scale data warehouse
- Features: Natural language queries across terabytes of data
- Specializes in: Nested and repeated fields (STRUCT, ARRAY types)
- Learning curve: Medium - requires BigQuery knowledge
- Cost tip: Monitor query costs carefully

### For Advanced (2-3 years experience)

**5. dbt MCP Server** - Best for Metric Consistency
- When to use: Teams using dbt, need governed analytics
- Benefits: 85-90% query accuracy, cuts AI errors by 66%
- Uses: Approved metrics and joins (semantic layer)
- Best for: Production analytics, metric governance
- Learning curve: High - requires dbt knowledge
- Prerequisite: Team already using dbt

## By Task Type

### SQL Query & Database Work
- **PostgreSQL MCP** - Direct Postgres access
- **BigQuery MCP** - Google Cloud data warehouse
- **Snowflake MCP** - Snowflake-only teams
- **Amazon Redshift MCP** - AWS teams
- **LocalData MCP** - Multi-database support

### Data Science & Analysis
- **MCP Data Science** - Complete pipeline, 102 tools
- **LocalData MCP** - Multi-source + statistical analysis
- **MCP Analytics** - Professional analysis with library

### BI & Visualization
- **Power BI MCP** - Microsoft ecosystem
- **Apache Superset MCP** - Open-source, build-capable
- **Domo MCP** - Interactive dashboards
- **Looker MCP** - LookML-defined metrics

### Data Pipeline & ETL
- **dbt MCP** - Transformation with semantic layer
- **Glean MCP** - Multi-connector enterprise search

## Choosing the Right MCP Server

### Decision Framework

1. **What data are you working with?**
   - Single PostgreSQL database → PostgreSQL MCP
   - Multiple database types → LocalData MCP
   - Cloud warehouse (BigQuery/Snowflake) → Use specific server
   - CSV/Excel files → MCP Data Science or LocalData MCP

2. **What's your skill level?**
   - Beginner → PostgreSQL MCP + MCP Data Science
   - Intermediate → Add LocalData MCP
   - Advanced → Add dbt MCP if using dbt

3. **What's your task?**
   - Ad-hoc queries → Database-specific MCP
   - End-to-end analysis → MCP Data Science or LocalData MCP
   - BI dashboards → Power BI, Superset, or Domo MCP
   - Production metrics → dbt MCP

4. **What's your environment?**
   - Google Cloud → BigQuery MCP
   - AWS → Redshift MCP
   - Microsoft → Power BI MCP
   - On-premise PostgreSQL → PostgreSQL MCP

## Getting Started Workflow

### Step 1: Check Available MCP Servers
```
Use mcp_list_servers to see what's configured
```

### Step 2: Explore Tools
```
Use mcp_list_tools for each relevant server
```

### Step 3: Start Simple
- Begin with PostgreSQL MCP for SQL queries
- Add MCP Data Science for file-based analysis
- Expand to LocalData MCP as needs grow

### Step 4: Safety First
- Always use read-only database accounts for AI queries
- Test queries on small datasets first
- Validate AI-generated SQL before execution
- Monitor costs for cloud warehouses

## Best Practices for Junior Analysts

### 1. Start with Read-Only Access
- Never give AI write access to production databases
- Use separate read-only user accounts
- Validate all generated SQL manually

### 2. Learn from AI Explanations
- Ask AI to explain complex queries
- Study the SQL patterns it generates
- Understand optimization suggestions

### 3. Build Gradually
- Master one MCP server before adding more
- Start with PostgreSQL MCP for SQL basics
- Add data science tools as you need them

### 4. Validate Results
- Cross-check AI analysis with manual calculations
- Verify statistical assumptions
- Test on known-good datasets

### 5. Document Your Work
- Save successful query patterns
- Note which MCP servers work best for which tasks
- Build a personal library of reusable approaches

## Common Use Cases & Recommended MCP

### "I need to analyze customer churn"
- **Best:** MCP Data Science (has churn analysis built-in)
- **Alternative:** LocalData MCP (statistical analysis tools)

### "I need to query our PostgreSQL database"
- **Best:** PostgreSQL MCP (direct access)
- **Alternative:** LocalData MCP (if also need other databases)

### "I need to create a dashboard"
- **Best:** Power BI MCP (if using Microsoft stack)
- **Alternative:** Apache Superset MCP (open-source)

### "I need to analyze Excel files"
- **Best:** MCP Data Science (Excel support + analysis tools)
- **Alternative:** LocalData MCP (multi-format support)

### "I need consistent metrics across the team"
- **Best:** dbt MCP (semantic layer)
- **Alternative:** Looker MCP (LookML-defined metrics)

## Troubleshooting

### MCP Server Not Listed
- Check if the server is installed and configured
- Verify connection credentials
- Check MCP server logs

### Tools Not Working
- Verify permissions for the data source
- Check if the server supports the operation
- Review tool parameters

### Performance Issues
- For large datasets, use LocalData MCP (memory-bounded)
- For cloud warehouses, monitor query costs
- Use LIMIT clauses to test queries first

Ask the user:
- What data sources are they working with?
- What's their current experience level?
- What specific task are they trying to accomplish?
- What MCP servers are currently available?
