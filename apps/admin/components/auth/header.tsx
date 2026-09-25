interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <h2 className="font-serif text-lg sm:text-xl font-normal text-[#1A1A2E] text-center leading-tight">
      {label}
    </h2>
  );
};

export default Header;
