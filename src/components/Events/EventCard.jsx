import React from "react";
import styles from "../../styles/style";
import CountDown from "./CountDown.jsx";
import { backend_url } from "../../server";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const numDiscount = data && data.discountPrice;
  const numOrgin = data && data.originalPrice;
  const formatNumber = new Intl.NumberFormat("de-DE", {
    useGrouping: true,
  });
  const discountPrice = formatNumber.format(numDiscount);
  const originalPrice = formatNumber.format(numOrgin);

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Sản phẩm đã có trong giỏ hàng!");
    } else {
      if (data.stock < 1) {
        toast.error("Số lượng sản phẩm còn trong kho không đủ!");
      } else {
        const cartData = { ...data, qty: 1, idUser: user._id };
        dispatch(addTocart(cartData));
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      }
    }
  };

  return (
    <div
      className={`w-full block bg-white ${
        active ? "unset" : "mb-12"
      } rounded-lg lg:flex p-2`}
    >
      <div className="w-full lg:-w[50%] m-auto flex justify-center items-center">
        <div
          className=" w-[75%] 
        "
        >
          <img
            src={`${backend_url}${data && data.images[0]}`}
            alt=""
            className="w-60% h-auto"
          />
        </div>
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data && data.name}</h2>
        <p>{data && data.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              {originalPrice}₫
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              {discountPrice}₫
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            Đã bán {data && data?.sold_out}
          </span>
        </div>
        <CountDown data={data && data} />
        <br />
        <div className="flex justify-center items-center">
          <Link to={`/product/${data && data._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>Xem chi tiết</div>
          </Link>
          <div
            className={`${styles.button} text-[#fff] ml-5`}
            onClick={() => addToCartHandler(data && data)}
          >
            Thêm vào giỏ hàng
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
