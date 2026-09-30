export function authorizeModification(req, res, next) {
  const isChild = req.user.role === "child";
  const isDifferentUser = String(req.user.id) !== String(req.params.userId);

  if (isChild && isDifferentUser) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  next();
}
