---
name: mssql-debug
description: Debug Microsoft SQL Server issues with comprehensive guidance
argument-hint: "[query|procedure|error]"
allowed-tools:
  - read
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

Help debug Microsoft SQL Server issues. Follow this systematic approach:

## 1. Identify the Problem Type

Determine if the issue is:
- **Performance problem** (slow queries, timeouts, deadlocks)
- **Error message** (syntax errors, constraint violations, runtime errors)
- **Incorrect results** (data not matching expectations)
- **Connection issue** (login failures, network problems)
- **Schema/data issue** (missing objects, bad data)

## 2. Gather Information

Check for:
- The exact error message or symptom
- When the issue occurs (time, frequency)
- Which database and objects are affected
- Recent changes (schema updates, data changes, deployments)
- Query text or stored procedure code
- Execution plans (SHOWPLAN output)

## 3. Common Debugging Techniques

### Performance Issues
- Use `SET STATISTICS IO ON` and `SET STATISTICS TIME ON` to analyze query performance
- Check execution plans with `SET SHOWPLAN_TEXT ON` or `SET SHOWPLAN_XML ON`
- Look for missing indexes using sys.dm_db_missing_index_details
- Check for parameter sniffing issues
- Review index usage with sys.dm_db_index_usage_stats
- Check for blocking with sys.dm_exec_requests

### Error Messages
- Check error codes in sys.messages
- Review SQL Server error logs
- Check TRY/CATCH blocks in procedures
- Verify RAISERROR usage
- Look for constraint violations (FK, PK, CHECK, UNIQUE)

### Deadlocks
- Enable trace flag 1222 for deadlock graphs
- Query sys.dm_tran_locks for lock information
- Review deadlock graphs in SQL Server Profiler or Extended Events
- Check transaction isolation levels
- Look for lock escalation

### Connection Issues
- Verify connection string parameters
- Check SQL Server authentication mode
- Review firewall rules
- Test with different tools (SSMS, sqlcmd)
- Check network connectivity

## 4. Use DMVs for Diagnostics

Key Dynamic Management Views:
- `sys.dm_exec_requests` - Currently executing requests
- `sys.dm_exec_sessions` - User sessions
- `sys.dm_exec_sql_text` - SQL text for running queries
- `sys.dm_exec_query_plan` - Execution plans
- `sys.dm_db_index_physical_stats` - Index fragmentation
- `sys.dm_os_wait_stats` - Wait statistics
- `sys.dm_os_performance_counters` - Performance counters

## 5. Analysis Steps

1. **Reproduce the issue** if possible
2. **Isolate the problem** to specific objects/queries
3. **Gather metrics** before and after changes
4. **Test hypotheses** systematically
5. **Document findings** with specific evidence

## 6. Common Solutions

Performance:
- Add appropriate indexes
- Update statistics
- Rewrite queries for better plan
- Use query hints carefully
- Consider partitioning for large tables
- Optimize tempdb usage

Errors:
- Fix syntax errors
- Add proper error handling
- Validate data constraints
- Check data types
- Review transaction logic

Deadlocks:
- Use appropriate isolation levels
- Optimize query order
- Keep transactions short
- Use optimistic concurrency where possible
- Add NOLOCK hints (carefully) if acceptable

## 7. Verification

After applying fixes:
- Test with realistic data volumes
- Monitor performance metrics
- Check for side effects
- Verify with different scenarios
- Document the solution

## 8. Best Practices

- Always test in non-production first
- Use transactions when making changes
- Backup before schema modifications
- Use parameterized queries to prevent SQL injection
- Monitor production after changes
- Keep statistics up to date
- Regular index maintenance

Ask the user to provide:
- The specific issue they're experiencing
- Error messages (if any)
- Query or procedure code
- Database schema details
- Any relevant context about when/how the issue occurs
