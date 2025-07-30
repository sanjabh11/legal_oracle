
async def get_current_admin_user(
    authorization: str = Header(None, convert_underscores=False),
) -> Dict[str, Any]:
    """Stub for admin user dependency. In production, add role check."""
    # For now, just use get_current_user
    return await get_current_user(authorization)
