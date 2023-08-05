import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/style";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { backend_url, server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const formatNumber = new Intl.NumberFormat("de-DE", {
    useGrouping: true,
  });
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Chi tiết đơn hàng</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Mã đơn hàng: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
      </div>

      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex justify-between mb-5">
            <div className="w-full flex items-start justify-between mb-5">
              <div>
                <img
                  src={`${backend_url}${item.images[0]}`}
                  alt=""
                  className="w-[200px] h-auto"
                />
              </div>
              <div className="w-full items-center ms-2">
                <h5 className="pl-3  mx-2  mb-1 text-[18px]">{item.name}</h5>
                <h5 className="pl-3 mx-2 mb-1  text-[18px]">
                  Giá: {formatNumber.format(item.discountPrice)}₫
                </h5>
                <h5 className="pl-3 mx-2  mb-1 text-[18px]">
                  Số lượng: {item.qty}
                </h5>
                <h5 className="pl-3 mx-2 mb-1  text-[18px]">
                  Đã đặt vào ngày: <span>{data?.createdAt?.slice(0, 10)}</span>
                </h5>
              </div>
            </div>
            {!item.isReviewed && data?.status === "Delivered" ? (
              <div
                className={`${styles.button} text-[#fff]`}
                onClick={() => setOpen(true) || setSelectedItem(item)}
              >
                Đánh giá
              </div>
            ) : null}
          </div>
        ))}

      <div className="border-t w-full ">
        <h5 className="pt-3 text-[18px]">
          Tổng tiền:<strong>{formatNumber.format(data?.totalPrice)}₫</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%] flex">
          <h4 className="mx-1 pt-2 text-[20px] font-[600]">
            Địa chỉ giao hàng :
          </h4>
          <h4 className="mx-1 pt-2 text-[20px]">
            {data?.shippingAddress.address1},{data?.shippingAddress.city},{" "}
            {data?.shippingAddress.state},{data?.shippingAddress.country},
          </h4>
        </div>
      </div>
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%] flex">
          <h4 className="mx-1 pt-2 text-[20px] font-[600]">Số điện thoại:</h4>
          <h4 className="mx-1 pt-2 text-[20px]">0{data?.user?.phoneNumber}</h4>
        </div>
      </div>
      <br />
      <Link to="/">
        <div className={`${styles.button} text-white`}>Send Message</div>
      </Link>
      <br />
      <br />
      {/* review popup */}
      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="800px:w-[50%]  400px:w-90% h-min bg-[#fff] shadow rounded-md p-3">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-[500]  text-center">Đánh giá</h2>
            <br />
            <div className="w-full flex ml-2">
              <img
                src={`${backend_url}${selectedItem?.images[0]}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div className="ml-1">
                <div className="pl-3 text-[16px]">{selectedItem?.name}</div>
                <h4 className="pl-3 text-[16px]">
                  Giá: {selectedItem?.discountPrice}₫
                </h4>
                <h4 className="pl-3 text-[16px]">
                  Số lượng: {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            {/* ratings */}
            <h5 className="pl-3 text-[20px] font-[500]  ml-2">
              Đánh giá <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full pt-1  ml-2">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-2">
              <label className="block text-[20px] font-[500]">
                Viết bình luận
                <span className="ml-1 font-[400] text-[16px] text-[#00000052] ">
                  (Không bắt buộc)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expresion about it!"
                className="mt-2 w-[95%]  p-2 outline-none border-[1px] border-black"
              ></textarea>
            </div>
            <div className="flex justify-center items-center w-full">
              {" "}
              <div
                className={`${styles.button} text-white text-[20px] ml-3 `}
                onClick={rating >= 1 ? reviewHandler : null}
              >
                Đánh giá
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetails;
