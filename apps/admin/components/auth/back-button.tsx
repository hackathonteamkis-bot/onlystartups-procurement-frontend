import { Button } from "@onlystartups/ui";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button
      variant="link"
      className="font-medium w-full text-[#1A1A2E]/70 hover:text-[#F26522] transition-colors duration-200 text-sm sm:text-base"
      size="sm"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;
