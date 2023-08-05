import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/style";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiPlus, HiOutlineMinus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../server";
import { addTocart, removeFromCart } from "../../redux/actions/cart";

export const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const formatNumber = new Intl.NumberFormat("de-DE", {
    useGrouping: true,
  });
  const userId = user && user._id;
  const CartOfUser = cart.filter((product) => product.idUser === userId);
  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = CartOfUser.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );
  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {CartOfUser && CartOfUser.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Không có sản phẩm nào trong giỏ hàng!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* Item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {CartOfUser && CartOfUser.length} sản phẩm
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {CartOfUser &&
                  CartOfUser.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      formatNumber={formatNumber}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* checkout buttons */}
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Thanh Toán ({formatNumber.format(totalPrice)}₫)
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({
  data,
  quantityChangeHandler,
  removeFromCartHandler,
  formatNumber,
}) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const discountPrice = formatNumber.format(data.discountPrice);
  const numTotalPrice = formatNumber.format(totalPrice);
  const increment = (data) => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };
  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartDatat = { ...data, qty: value === 1 ? 1 : value - 1 };

    quantityChangeHandler(updateCartDatat);
  };
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <img
          src={`${backend_url}${data?.images[0]}`}
          alt=""
          className="w-[130px] h-min mr-2 rounded-[5px] ml-2"
        />
        <div className="pl-[5px]">
          <h1 className="text-[18px] font-[600]">{data.name}</h1>
          <h1>{discountPrice}₫</h1>
          <div className="w-full flex ">
            <div
              className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
              onClick={() => decrement(data)}
            >
              <HiOutlineMinus size={14} color="#7d879c" />
            </div>
            <span className="pl-[10px] text-lg mx-1">{value}</span>
            <div
              className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer ml-1`}
              onClick={() => increment(data)}
            >
              <HiPlus size={14} color="#fff" />
            </div>
          </div>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            {numTotalPrice}₫
          </h4>
        </div>
        <div className="flex justify-end ">
          <AiOutlineDelete
            className="cursor-pointer"
            onClick={() => removeFromCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};
export default Cart;
