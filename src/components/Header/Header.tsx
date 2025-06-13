import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/Icon/Icon";

type HeaderProps = {
  redirectionList: string[];
};
const Header = ({ redirectionList }: HeaderProps) => {
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // const [openMenu, setOpenMenu] = useState<"SETTING" | "EVALUTION" | null>(
  //   null
  // );
  // const handleMouseEnter = (menu: "SETTING" | "EVALUTION") => setOpenMenu(menu);
  // const handleMouseLeave = () => setOpenMenu(null);
  // const handleClick = () => setOpenMenu(null); // 클릭 시 닫기

  const handleNavigate = (url: string) => {
    switch (url) {
      case "APPLY LIST":
        navigate("applies");
        break;
      case "DASHBOARD":
        navigate("");
        break;
      default:
        return;
    }
  };

  return (
    <header className="bg-gradient-to-b from-gray-900 from-30% to-transparent text-white">
      <div className="flex items-center justify-between z-50 px-16 py-8">
        <Link to="/" className="z-50">
          <Icon type="TaveLogo" width={100} height={40} />
        </Link>
        <nav>
          <ul className="flex gap-x-4 font-base items-center">
            {redirectionList.map((item, index) => (
              <li
                key={index}
                className="group hover:bg-gray-800 px-4 py-3 rounded-xl text-gray-400 hover:text-white relative"
              >
                <button
                  className="relative z-50"
                  onClick={() => handleNavigate(item)}
                >
                  {item}
                </button>
                {item === "SETTING" && (
                  <ul className="absolute z-99 top-14 left-0 w-full bg-gray-800 text-gray-400 px-4 py-3 rounded-xl flex flex-col gap-3 text-center hidden group-hover:flex transition-all duration-200">
                    <li
                      className="hover:text-white cursor-pointer"
                      onClick={() => navigate("/setting/default")}
                    >
                      기본 설정
                    </li>
                    <li
                      className="hover:text-white cursor-pointer"
                      onClick={() => navigate("/setting/document")}
                    >
                      서류 설정
                    </li>
                    <li
                      className="hover:text-white cursor-pointer"
                      onClick={() => navigate("/setting/interview")}
                    >
                      면접 설정
                    </li>
                    <li
                      className="hover:text-white cursor-pointer"
                      onClick={() => navigate("/setting/final")}
                    >
                      최종 합격
                    </li>
                  </ul>
                )}
                {/* hover를 유지하기 위한 spacer */}
                <div className="absolute top-full left-0 w-full h-2" />
                {item === "EVALUTION" && (
                  <ul className="absolute top-14 left-0 w-full bg-gray-800 text-gray-400 px-4 py-3 rounded-xl flex flex-col gap-3 text-center hidden group-hover:flex transition-all duration-200">
                    <li
                      className="hover:text-white cursor-pointer"
                      onClick={() => navigate("/evalution/document")}
                    >
                      서류 평가
                    </li>
                    <li
                      className="hover:text-white cursor-pointer"
                      onClick={() => navigate("/evalution/interview")}
                    >
                      면접 평가
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <button
          className="relative group bg-gray-800 py-2 px-4 rounded-[10px] cursor-pointer flex gap-2"
          onClick={() => setIsLogoutOpen(!isLogoutOpen)}
        >
          홍길동님
          <Icon type="ChevronDown" size={24} />
          <div className="absolute top-full left-0 w-full h-2" />
          <ul
            className={`absolute top-12 left-0 w-full bg-gray-800 text-gray-400 px-4 py-3 rounded-xl flex flex-col gap-3 text-center ${
              isLogoutOpen ? "flex" : "hidden"
            } transition-all duration-200`}
          >
            <li className="hover:text-white cursor-pointer">로그아웃</li>
          </ul>
        </button>
      </div>
    </header>
  );
};

export default Header;
