import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}/`);
                setOrder(response.data);
            } catch (error) {
                setError("Error fetching order details");
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className="container py-5">Loading...</div>;
    if (error) return <div className="container py-5 text-danger">{error}</div>;
    if (!order) return <div className="container py-5">Order not found</div>;

    return (
        <div className="container py-5">
            <h2>Order Details</h2>
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Customer Information</h5>
                            <p><strong>Name:</strong> {order.name}</p>
                            <p><strong>Phone:</strong> {order.phone_number}</p>
                            <p><strong>Address:</strong> {order.delivery_address}</p>
                            <p><strong>Payment Method:</strong> {order.payment_method}</p>
                            <p>
                                <strong>Order Status:</strong>{" "}
                                {order.order_status === "pending" && <i className="fa-regular fa-clock" />}{" "}
                                {order.order_status === "preparing" && <i className="fa-solid fa-burger"></i>}{" "}
                                {order.order_status === "ready" && <i className="fa-solid fa-truck-fast"></i>}{" "}
                                {order.order_status === "delivered" && <i className="fa-solid fa-circle-check" style={{ color: "green" }}></i>}{" "}
                                {order.order_status === "cancelled" && <i className="fa-solid fa-rectangle-xmark" style={{ color: "red" }}></i>}{" "}
                                {order.order_status}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Order Summary</h5>
                            {order.items?.map(item => {
                                const itemTotal = item.item_price * item.quantity;
                                return (
                                    <div key={item.id} className="d-flex justify-content-between mb-2">
                                        <span>{item.quantity}x {item.menu_item.name}</span>
                                        <span>${itemTotal.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                            <hr />
                            <div className="d-flex justify-content-between">
                                <strong>Total:</strong>
                                <strong>${parseFloat(order.total_price || 0).toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}