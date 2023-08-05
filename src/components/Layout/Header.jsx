import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../../styles/style";
import { categoriesData, productData } from "../../static/data";
import { CgProfile } from "react-icons/cg";
import {
  AiOutlineSearch,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { DropDown } from "./DropDown.jsx";
import Navbar from "./Navbar.jsx";
import { useSelector } from "react-redux";
import { backend_url } from "../../server";
import Cart from "../cart/Cart.jsx";
import Wishlist from "../Wishlist/Wishlist.jsx";
import { RxCross1 } from "react-icons/rx";

export const Header = ({ activeHeading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [open, setOpen] = useState(false);
  const { allProducts } = useSelector((state) => state.products);
  const { isSeller } = useSelector((state) => state.seller);

  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const userId = user && user._id;
  const cartUser = cart.filter((product) => product.idUser === userId);

  const { wishlist } = useSelector((state) => state.wishlist);
  const wishlistUser = wishlist.filter((product) => product.idUser === userId);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });
  return (
    <>
      <div className={`${style.section}`}>
        <div className="hidden 1000px:h-[50px] 1000px:my-[20px] 1000px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo-3.svg"
                alt=""
              />
            </Link>
          </div>

          {/*search box*/}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product ..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="absolute w-full  bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link to={`/product/${i._id}`}>
                        <div className="w-full flex items-start-py-3">
                          <img
                            src={`${backend_url}${i.images[0]}`}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>
          <div className={`${style.button}`}>
            <Link to="/shop-create">
              <h1 className="text-[#fff] flex items-center">
                {isSeller ? "View Shop" : "Become Seller"}{" "}
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10 " : null
        } transition hidden 1000px:flex items-center justify-between w-full bg-[#1d4ed8] h-[70px]`}
      >
        <div
          className={`${style.section} relative ${style.noramlFlex} justify-between`}
        >
          {/*categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
              >
                Danh mục
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/**navitems */}
          <div className={`${style.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>
          <div className="flex">
            <div className={`${style.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlistUser && wishlistUser.length}
                </span>
              </div>
            </div>
            <div className={`${style.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cartUser && cartUser.length}
                </span>
              </div>
            </div>{" "}
            <div className={`${style.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${backend_url}${user.avatar}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* cart popup */}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

          {/* wishlist popup */}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
        </div>
      </div>

      {/**mobile header */}

      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        }
      w-full h-[140px] bg-[#fff] z-50 top-0 left-0 shadow-sm 1000px:hidden`}
      >
        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <div>
              <BiMenuAltLeft
                size={40}
                className="ml-4"
                onClick={() => setOpen(true)}
              />
            </div>
            <div>
              <Link to="/">
                <img
                  src="https://shopo.quomodothemes.website/assets/images/logo-3.svg"
                  alt=""
                  className="mt-3 cursor-pointer"
                />
              </Link>
            </div>
            <div className="flex">
              <div className={`${style.noramlFlex}`}>
                <div
                  className="relative cursor-pointer mr-[15px]"
                  onClick={() => setOpenWishlist(true)}
                >
                  <AiOutlineHeart size={30} />
                  <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                    {wishlistUser && wishlistUser.length}
                  </span>
                </div>
              </div>
              <div className={`${style.noramlFlex}`}>
                <div
                  className="relative cursor-pointer mr-[15px]"
                  onClick={() => setOpenCart(true)}
                >
                  <AiOutlineShoppingCart size={30} />
                  <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                    {cartUser && cartUser.length}
                  </span>
                </div>
              </div>{" "}
            </div>
            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
          <div className="my-8 w-[92%] m-auto h-[40px relative]">
            <input
              type="search"
              placeholder="Search Product..."
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchData && (
              <div className="absolute bg-[#fff] z-10 shadow w-[92%]  p-3 rounded-sm border-slate-900 border-[1px]">
                {searchData.map((i) => {
                  const d = i.name;

                  const Product_name = d.replace(/\s+/g, "-");
                  return (
                    <Link to={`/product/${Product_name}`}>
                      <div className="flex items-center">
                        <img
                          src={`${backend_url}${i.images[0]}`}
                          alt=""
                          className="w-[50px] mr-2"
                        />
                        <h5>{i.name}</h5>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* header sidebar */}
        {open && (
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3 pb-10">
                <div className="flex justify-center items-center">
                  <div className={`${style.noramlFlex}`}>
                    <div className="relative cursor-pointer mr-[15px]">
                      {isAuthenticated ? (
                        <Link to="/profile">
                          <img
                            src={`${backend_url}${user.avatar}`}
                            className="w-[70px] h-[70px] rounded-full my-3 ml-3 border-[3px] border-[#3ad132]"
                            alt=""
                          />
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    {isAuthenticated ? (
                      <h1 className="text-xl font-bold">{user.name}</h1>
                    ) : (
                      <Link to="/login">
                        <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                      </Link>
                    )}
                  </div>
                </div>
                <div>
                  <RxCross1
                    size={30}
                    className="ml-4 mt-5 flex"
                    onClick={() => setOpen(false)}
                  />
                </div>
              </div>

              <Navbar active={activeHeading} />
              <div className={`${style.button}  !rounded-[4px] w-full`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    {isSeller ? " View Shop" : " Become Seller"}
                    <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>

              {isAuthenticated ? null : (
                <div className={`${style.button}  !rounded-[4px] w-full`}>
                  <Link to="/login">
                    <h1 className="text-[#fff] flex items-center">Đăng nhập</h1>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Header;
