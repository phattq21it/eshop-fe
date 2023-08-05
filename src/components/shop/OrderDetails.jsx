import React, { useEffect, useState } from "react";
import styles from "../../styles/style";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { backend_url, server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const formatNumber = new Intl.NumberFormat("de-DE", {
    useGrouping: true,
  });
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Đã cập nhật đơn hàng!");
        navigate("/dashboard-orders");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Đã cập nhật đơn hàng!");
        dispatch(getAllOrdersOfShop(seller._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Chi tiết đơn hàng</h1>
        </div>
        <Link to="/dashboard-orders">
          <div
            className={`!w-[200px] text-center  !bg-[#fce1e6] !rounded-[4px] text-[#ff3d5d] font-[600] !h-[45px] text-[18px]`}
          >
            Danh sách danh mục
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Mã đơn hàng: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Đã đặt vào ngày: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-start  justify-between mb-5">
            <div>
              <img
                src={`${backend_url}${item.images[0]}`}
                alt=""
                className="w-[200px] h-auto"
              />
            </div>
            <div className="w-full items-center ms-2">
              <h5 className="pl-3  m-2 text-[20px]">{item.name}</h5>
              <h5 className="pl-3 m-2  text-[20px]">
                Giá: {formatNumber.format(item.discountPrice)}₫
              </h5>
              <h5 className="pl-3 m-2 text-[20px]">Số lượng: {item.qty}</h5>
            </div>
          </div>
        ))}
      <div className="flex w-full">
        <div className="w-[80%]">
          <div className="border-t w-full ">
            <h5 className="pt-3 text-[18px]">
              Tổng tiền:{" "}
              <strong>{formatNumber.format(data?.totalPrice)}₫</strong>
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
              <h4 className="mx-1 pt-2 text-[20px] font-[600]">
                Số điện thoại:
              </h4>
              <h4 className="mx-1 pt-2 text-[20px]">
                0{data?.user?.phoneNumber}
              </h4>
            </div>
          </div>
        </div>
        <div className="w-[20%] flex justify-end">
          <div>
            <h4 className="pt-3 text-[20px] font-[600]">
              Trạng thái đơn hàng:
            </h4>
            {data?.status !== "Processing refund" &&
              data?.status !== "Refund Success" && (
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
                >
                  {[
                    "Processing",
                    "Transferred to delivery partner",
                    "Shipping",
                    "Received",
                    "On the way",
                    "Delivered",
                  ]
                    .slice(
                      [
                        "Processing",
                        "Transferred to delivery partner",
                        "Shipping",
                        "Received",
                        "On the way",
                        "Delivered",
                      ].indexOf(data?.status)
                    )
                    .map((option, index) => (
                      <option value={option} key={index}>
                        {option}
                      </option>
                    ))}
                </select>
              )}
            {data?.status === "Processing refund" ||
            data?.status === "Refund Success" ? (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
              >
                {["Processing refund", "Refund Success"]
                  .slice(
                    ["Processing refund", "Refund Success"].indexOf(
                      data?.status
                    )
                  )
                  .map((option, index) => (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  ))}
              </select>
            ) : null}
            <div
              className={`${styles.button} !w-full mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px]`}
              onClick={
                data?.status !== "Processing refund"
                  ? orderUpdateHandler
                  : refundOrderUpdateHandler
              }
            >
              Cập nhật trạng thái
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />
    </div>
  );
};

export default OrderDetails;
