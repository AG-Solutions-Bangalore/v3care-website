import React from 'react';
import HomeHeader from '../../home/header/home-header';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import { RootState } from '../../../../core/redux/store';
import { clearCart, removeFromCart } from '../../../../core/redux/slices/CartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth < 600);


  React.useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const groupedItems = cartItems.reduce((acc: any, item) => {
    const key = `${item.service_id}-${item.service_sub_id || 'none'}`;
    if (!acc[key]) {
      acc[key] = {
        service_name: item.service_name,
        service_sub_name: item.service_sub_name,
        items: [],
        total: 0,
        originalTotal: 0
      };
    }
    acc[key].items.push(item);
    acc[key].total += parseFloat(item.service_price_amount);
    acc[key].originalTotal += parseFloat(item.service_price_rate);
    return acc;
  }, {});


  const totalPrice = Object.values(groupedItems).reduce((sum: number, group: any) => sum + group.total, 0);
  const totalOriginalPrice = Object.values(groupedItems).reduce((sum: number, group: any) => sum + group.originalTotal, 0);



  return (
    <>
      <HomeHeader />
      <div className="col-xl-4 theiaStickySidebar">
                <StickyBox>
                  <div className="card border-0 d-none d-lg-block">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between border-bottom mb-3">
                        <div className="d-flex align-items-center">
                          <div className="mb-3">
                            <p className="fs-14 mb-0">Total Amount</p>
                            <h4>
                              <span className="display-6 fw-bold">
                                ₹{totalPrice.toFixed(2) || '0'}
                              </span>
                              {totalOriginalPrice > 0 && (
                                <span className="text-decoration-line-through text-default">
                                  {' '}
                                  ₹{totalOriginalPrice.toFixed(2)}
                                </span>
                              )}
                            </h4>
                          </div>
                        </div>
                        {totalOriginalPrice > 0 && (
                          <span className="badge bg-success mb-3 d-inline-flex align-items-center fw-medium">
                            <i className="ti ti-circle-percentage me-1" />
                            {Math.round((1 - (totalPrice / totalOriginalPrice)) * 100)}% Off
                          </span>
                        )}
                      </div>

                   

                      <div className="mt-4">
                        <h6 className="mb-3">Order Summary</h6>
                        <div className="list-group list-group-flush">
                          {Object.entries(groupedItems).map(([key, group]: [string, any]) => (
                            <div key={key} className="list-group-item px-0 py-2">
                              <div className="d-flex justify-content-between">
                                <span className="fw-medium">
                                  {group.service_name}
                                  {group.service_sub_name && ` (${group.service_sub_name})`}
                                </span>
                                <span>₹{group.total.toFixed(2)}</span>
                              </div>
                              <div className="small text-muted">
                                {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </StickyBox>
              </div>
    </>
  );
};

export default Cart;