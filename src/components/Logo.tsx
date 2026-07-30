import { Link } from "react-router-dom";
import { BRAND_NAME, LOGO_URL } from "@/config/constants";

type LogoProps = {
  className?: string;
  linkTo?: string;
  alt?: string;
};

export function Logo({ className = "h-16 md:h-20 w-auto object-contain", linkTo = "/", alt = BRAND_NAME }: LogoProps) {
  return (
    <Link to={linkTo} className="flex items-center gap-2">
      <img src={LOGO_URL} alt={alt} className={className} />
    </Link>
  );
}
