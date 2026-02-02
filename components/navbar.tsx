import Link from "next/link";
import DownloadButtons from "./downloadButtons";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  const navList = [
    { title: "اضافة منتج", href: "/product" },
    { title: "اضافة شركة", href: "/company" },
    { title: "الترصيد", href: "/" },
  ];
  return (
    <div className="w-full py-3 mb-4 border-b border-dashed border-gray-700 flex justify-between items-center px-8">
      <DownloadButtons />
      <ul className="flex justify-center items-center font-medium">
        {navList.map((item) => (
          <li key={item.href}>
            <Link
              className={buttonVariants({ variant: "ghost" })}
              href={item.href}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
