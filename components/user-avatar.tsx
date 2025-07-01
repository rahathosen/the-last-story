interface UserAvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({
  name,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const getInitials = (name?: string) => {
    if (!name) return "A"; // Anonymous
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const initials = getInitials(name);

  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-medium border border-slate-500/30`}
    >
      {initials}
    </div>
  );
}
