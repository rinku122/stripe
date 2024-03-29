import React, { useEffect, useState } from "react";
import "./cartstyle.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeToCart,
  removeSingleIteams,
  emptycartIteam,
} from "../redux/features/cartSlice";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const CartDetails = () => {
  const { carts } = useSelector((state) => state.allCart);

  const [totalprice, setPrice] = useState(0);
  const [totalquantity, setTotalQuantity] = useState(0);

  const dispatch = useDispatch();

  // add to cart
  const handleIncrement = (e) => {
    dispatch(addToCart(e));
  };

  // remove to cart
  const handleDecrement = (e) => {
    dispatch(removeToCart(e));
    toast.success("Item Remove From Your Cart");
  };

  // remove single item
  const handleSingleDecrement = (e) => {
    dispatch(removeSingleIteams(e));
  };

  // empty cart
  const emptycart = () => {
    dispatch(emptycartIteam());
    toast.success("Your Cart is Empty");
  };

  // count total price
  const total = () => {
    let totalprice = 0;
    carts.map((ele, ind) => {
      totalprice = ele.price * ele.qnty + totalprice;
    });
    setPrice(totalprice);
  };

  // count total quantity
  const countquantity = () => {
    let totalquantity = 0;
    carts.map((ele, ind) => {
      totalquantity = ele.qnty + totalquantity;
    });
    setTotalQuantity(totalquantity);
  };

  useEffect(() => {
    total();
  }, [total]);

  useEffect(() => {
    countquantity();
  }, [countquantity]);

  // payment integration stripe
  const makePaymentStripe = async () => {
    const stripe = await loadStripe(
      "pk_test_51OZB5ZB2KnGaDnZaVqCzcVvfTpCbMJZzeVX5FrZMlY4BCxcvKpatwAmsIWCNspSy55DzpQE8w1lfyAz4JWdC7h3U00nGu1eVpj"
    );
    console.log(stripe);

    const lineItems = carts.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.dish,
          images: [product.imgdata],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.qnty,
    }));

    const body = {
      lineItems,
      mode: "payment",
      payment_method_types: ["card"],
      metadata: {
        user_id: "Rajesh_319",
      },
    };
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch("http://localhost:8000/stripe", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  // Phonepay
  const makePaymentPhonepay = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const data = {
      name: "Waleed",
      amount: totalprice * 100,
      number: "7498608775",
      MUID: "MUID" + Date.now(),
      transactionId: "T" + Date.now(),
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const response = await fetch("http://localhost:8000/phonepay", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    const url = (await response.json()).url;

    window.location.href = url;
  };

  // Razorpay;
  const makePaymentRazorpay = async (e) => {
    const request = {
      amount: totalprice * 100,
      currency: "INR",
      receipt: `ant_user`,
      payment_capture: 1,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    let response = await fetch("http://localhost:8000/razorpay", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(request),
    });

    response = await response.json();

    var options = {
      key: "rzp_test_NjdVZ6X9z6uZe4", // Enter the Key ID generated from the Dashboard
      amount: response.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://avatars.githubusercontent.com/u/25058652?v=4",
      order_id: response.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: "http://localhost:8001/razorpay/status",
      cancel_url: "http://localhost:3000/cancel",
      prefill: {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@antiersolutions.com",
        contact: "9000090000",
      },

      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#32a86d",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
    e.preventDefault();
  };

  const makePaymentCoinbaseCommerce = async () => {
    const headers = {
      "Content-Type": "application/json",
    };

    const products = [
      {
        id: 1,
        name: "Small Black Chair",
        price: 10,
        currency: "USD",
        description: "Soft Chair, Best value for Money",
      },
      {
        id: 2,
        name: "Spoon",
        price: 2,
        currency: "USDT",
        description: "Spoon gets the best value for Money",
      },
    ];

    const data = {
      product: products[0],
      metadata: { id: products[0].id, userID: 1 },
      pricing_type: "fixed_price",
    };

    let response = await fetch("http://localhost:8000/coinbase_commerce", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    response = await response.json();

    window.location.href = response.hosted_url;
  };

  return (
    <>
      <div className="row justify-content-center m-0">
        <div className="col-md-8 mt-5 mb-5 cardsdetails">
          <div className="card">
            <div className="card-header bg-dark p-3">
              <div className="card-header-flex">
                <h5 className="text-white m-0">
                  Cart Calculation{carts.length > 0 ? `(${carts.length})` : ""}
                </h5>
                {carts.length > 0 ? (
                  <button
                    className="btn btn-danger mt-0 btn-sm"
                    onClick={emptycart}
                  >
                    <i className="fa fa-trash-alt mr-2"></i>
                    <span>EmptyCart</span>
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="card-body p-0">
              {carts.length === 0 ? (
                <table className="table cart-table mb-0">
                  <tbody>
                    <tr>
                      <td colSpan={6}>
                        <div className="cart-empty">
                          <i className="fa fa-shopping-cart"></i>
                          <p>Your Cart Is Empty</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="table cart-table mb-0 table-responsive-sm">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th className="text-right">
                        {" "}
                        <span id="amount" className="amount">
                          Total Amount
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((data, index) => {
                      return (
                        <>
                          <tr>
                            <td>
                              <button
                                className="prdct-delete"
                                onClick={() => handleDecrement(data.id)}
                              >
                                <i className="fa fa-trash-alt"></i>
                              </button>
                            </td>
                            <td>
                              <div className="product-img">
                                <img src={data.imgdata} alt="" />
                              </div>
                            </td>
                            <td>
                              <div className="product-name">
                                <p>{data.dish}</p>
                              </div>
                            </td>
                            <td>{data.price}</td>
                            <td>
                              <div className="prdct-qty-container">
                                <button
                                  className="prdct-qty-btn"
                                  type="button"
                                  onClick={
                                    data.qnty <= 1
                                      ? () => handleDecrement(data.id)
                                      : () => handleSingleDecrement(data)
                                  }
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                                <input
                                  type="text"
                                  className="qty-input-box"
                                  value={data.qnty}
                                  disabled
                                  name=""
                                  id=""
                                />
                                <button
                                  className="prdct-qty-btn"
                                  type="button"
                                  onClick={() => handleIncrement(data)}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="text-right">
                              ₹ {data.qnty * data.price}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>&nbsp;</th>
                      <th colSpan={2}>&nbsp;</th>
                      <th>
                        Items In Cart <span className="ml-2 mr-2">:</span>
                        <span className="text-danger">{totalquantity}</span>
                      </th>
                      <th className="text-right">
                        Total Price<span className="ml-2 mr-2">:</span>
                        <span className="text-danger">₹ {totalprice}</span>
                      </th>
                      <th className="text-right">
                        <button
                          style={{ marginLeft: "5px" }}
                          className="btn btn-success"
                          onClick={makePaymentStripe}
                          type="button"
                        >
                          Stripe
                        </button>
                        <button
                          style={{ marginLeft: "5px" }}
                          className="btn btn-success"
                          onClick={makePaymentPhonepay}
                          type="button"
                        >
                          PhonePay
                        </button>
                        <button
                          style={{ marginLeft: "5px" }}
                          className="btn btn-success"
                          onClick={makePaymentRazorpay}
                          type="button"
                        >
                          Razorpay
                        </button>

                        <button
                          style={{ marginLeft: "5px" }}
                          className="btn btn-success"
                          onClick={makePaymentCoinbaseCommerce}
                          type="button"
                        >
                          CoinbaseCommerce
                        </button>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDetails;
