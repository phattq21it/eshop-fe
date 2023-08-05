import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../../styles/style";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import { backend_url } from "../../../server";
import { useSelector, useDispatch } from "react-redux";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Rating from "../../Products/Rating";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
export const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userId = user && user._id;
  const wishlistUser = wishlist.filter((product) => product.idUser === userId);
  const cartUser = cart.filter((product) => product.idUser === userId);
  const numDiscount = data.discountPrice;
  const numOrgin = data.originalPrice;
  const formatNumber = new Intl.NumberFormat("de-DE", {
    useGrouping: true,
  });
  const discountPrice = formatNumber.format(numDiscount);
  const originalPrice = formatNumber.format(numOrgin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlistUser && wishlistUser.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlistUser]);
  const addToCartHandler = (id) => {
    if (isAuthenticated) {
      const isItemExists = cartUser && cartUser.find((i) => i._id === id);
      if (isItemExists) {
        toast.error("Sản phẩm đã có trong giỏ hàng!");
      } else {
        if (data.stock < 1) {
          toast.error("Product stock limited!");
        } else {
          const cartData = { ...data, qty: 1, idUser: userId };

          dispatch(addTocart(cartData));
          toast.success("Thêm thành công!");
        }
      }
    } else {
      navigate("/login");
    }
  };
  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    if (isAuthenticated) {
      setClick(!click);
      const wishlistData = { ...data, idUser: userId };
      dispatch(addToWishlist(wishlistData));
    } else {
      navigate("/login");
    }
  };
  return (
    <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
      <div className="flex justify-end"></div>
      <Link
        to={`${
          isEvent === true
            ? `/product/${data._id}?isEvent=true`
            : `/product/${data._id}`
        }`}
      >
        <img
          src={`${backend_url}${data?.images && data?.images[0]}`}
          alt=""
          className="w-full h-[170px] object-contain"
        />
      </Link>
      <Link to="/">
        <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
      </Link>
      <Link
        to={`${
          isEvent === true
            ? `/product/${data._id}?isEvent=true`
            : `/product/${data._id}`
        }`}
      >
        <h4 className="pb-3 font-[500]">
          {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
        </h4>

        <div className="flex">
          <Rating rating={data?.ratings} />
        </div>

        <div className="py-2 flex items-center justify-between">
          <div className="flex">
            <h5 className={`${styles.productDiscountPrice}`}>
              {data.discountPrice === 0 ? discountPrice : discountPrice}₫
            </h5>
            <h4 className={`${styles.price}`}>
              {originalPrice ? originalPrice + "₫" : null}
            </h4>
          </div>
        </div>
        <div className="w-full flex justify-end">
          {" "}
          <span className="font-[400] text-[13px] text-[#68d284] ">
            Đã bán {data?.sold_out}
          </span>
        </div>
      </Link>

      <div>
        {click ? (
          <AiFillHeart
            size={22}
            className="cursor-pointer absolute right-2 top-5"
            onClick={() => removeFromWishlistHandler(data)}
            color={click ? "red" : "#333"}
            title="Add to wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            className="cursor-pointer absolute right-2 top-5"
            onClick={() => addToWishlistHandler(data)}
            color={click ? "red" : "#333"}
            title="Thêm vào yêu thích"
          />
        )}
        <AiOutlineShoppingCart
          size={25}
          className="cursor-pointer absolute right-2 top-14"
          onClick={() => addToCartHandler(data._id)}
          color="#444"
          title="Thêm vào giỏ hàng"
        />
        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </div>
  );
};
export default ProductCard;
