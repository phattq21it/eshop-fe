import React, { useState } from "react";
import styles from "../../styles/style";
import { City, Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllUsers } from "../../redux/actions/user";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [discountPrice, setDiscountPrice] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const formatNumber = new Intl.NumberFormat("de-DE", {
    useGrouping: true,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const paymentSubmit = async () => {
    if (
      address1 === "" ||
      zipCode === null ||
      country === "" ||
      state === "" ||
      city === ""
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
    } else {
      const shippingAddress = {
        address1,
        zipCode,
        country,
        state,
        city,
      };

      const orderDataa = {
        cart: cart,
        totalPrice: totalPrice,
        shippingAddress: shippingAddress,
        user: user,
      };
      // setOrderData(orderDataa);

      // const order = {
      //   cart: orderData?.cart,
      //   shippingAddress: orderData?.shippingAddress,
      //   user: user && user,
      //   totalPrice: orderData?.totalPrice,
      // };

      //create order
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      orderDataa.paymentInfo = {
        type: "Cash On Delivery",
      };

      await axios
        .post(`${server}/order/create-order`, orderDataa, config)
        .then((res) => {
          setOpen(false);
          navigate("/order/success");
          localStorage.setItem("cartItems", JSON.stringify([]));
          window.location.reload();
        });

      // update local storage with the updated orders array
      // localStorage.setItem("latestOrder", JSON.stringify(orderDataa));
    }
  };
  const userId = user && user._id;
  const CartOfUser = cart.filter((product) => product.idUser === userId);
  const subTotalPrice = CartOfUser.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );
  //this is shipping cost variable
  const shipping = 50000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          CartOfUser && CartOfUser.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Mã giảm giá không chính xác");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exists!");
        setCouponCode("");
      }
    });
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";
  const totalPrice = couponCodeData
    ? subTotalPrice + shipping - discountPercentenge
    : subTotalPrice + shipping;
  //
  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            state={state}
            setState={setState}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
            formatNumber={formatNumber}
          />
        </div>
      </div>
      <input
        className={`w-[500px] font-medium text-[20px] h-[40px] border-2 border-[#f63b60] text-center  bg-[#f63b60] text-[#fbfbfb] rounded-[3px] mt-8 cursor-pointer`}
        required
        value="Thanh toán"
        type="submit"
        onClick={paymentSubmit}
      />
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  zipCode,
  setZipCode,
}) => {
  console.log(user);
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Thông tin</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Họ và tên</label>
            <input
              type="text"
              required
              value={user && user.name}
              className={`${styles.input} !w-[95%] border-[1] border-zinc-500`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Địa chỉ Email</label>
            <input
              type="email"
              required
              value={user && user.email}
              className={`${styles.input} border-[1] border-zinc-500`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Số điện thoại</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className={`${styles.input} !w-[95%] border-[1] border-zinc-500`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Mã Zip</label>
            <input
              type="number"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`${styles.input} border-[1] border-zinc-500`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Quốc gia</label>
            <select
              className="w-[95%] border-x border-y border-zinc-500  h-[40px] rounded-[5px]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Quốc gia
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Tỉnh</label>
            <select
              className="w-[95%] border-x border-y border-zinc-500  h-[40px] rounded-[5px]"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option className="block pb-2" value="">
                Chọn Tỉnh
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Huyện</label>
            <select
              className="w-[95%] border-x border-y border-zinc-500  h-[40px] rounded-[5px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Chọn Huyện
              </option>
              {City &&
                City.getCitiesOfState(country, state).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="w-full">
          <div className="w-[50%]">
            <label className="block pb-2">Địa chỉ</label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} !w-[95%] border-[1] border-zinc-500 h-[40px] rounded-[5px]`}
            />
          </div>
        </div>
      </form>
      <h5
        className="text-[18px] cursor-pointer inline-block"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose From saved address
      </h5>
      {userInfo && (
        <div>
          {user &&
            user.addresses.map((item, index) => (
              <div className="w-full flex mt-1">
                <input
                  type="checkbox"
                  className="mr-3"
                  value={item.addressType}
                  onClick={() =>
                    setAddress1(item.address1) ||
                    setZipCode(item.zipCode) ||
                    setCountry(item.country) ||
                    setState(item.stateId) ||
                    setCity(item.city)
                  }
                />
                <h2>{item.addressType}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
  formatNumber,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Tổng tiền:</h3>
        <h5 className="text-[18px] font-[600]">
          {formatNumber.format(subTotalPrice)}₫
        </h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">
          Phí vận chuyển:
        </h3>
        <h5 className="text-[18px] font-[600]">
          {formatNumber.format(shipping)}₫
        </h5>
      </div>
      <br />
      <div className="flex justify-between border-b border-zinc-500 pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Giảm giá:</h3>
        <h5 className="text-[18px] font-[600]">
          -{" "}
          {formatNumber.format(discountPercentenge)
            ? formatNumber.format(discountPercentenge) + "₫"
            : null}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        {formatNumber.format(totalPrice)}₫
      </h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2 border-[1] border-zinc-500`}
          placeholder="Mã giảm giá"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className={`w-full h-[40px] border-2 border-[#f63b60] text-center bg-[#f63b60] text-[#fbfbfb] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Sử dụng"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;
