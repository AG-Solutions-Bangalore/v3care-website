<div className="accordion-item mb-4">
  <h2 className="accordion-header">
    <button
      className="accordion-button p-0"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#overview"
      aria-expanded="false"
    >
      Service Offered
    </button>
  </h2>
  <div
    id="overview"
    className="accordion-collapse collapse show"
  >
    <div className="accordion-body border-0 p-0 pt-3">

      <div className="bg-light-200 p-3 offer-wrap">


        {priceLoading ? (
          <div className="text-center py-4">
            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>
            <p className="mt-2">Loading prices...</p>
          </div>
        ) : priceError ? (
          <div className="alert alert-danger d-flex align-items-center justify-content-between">
            <div>{priceError}</div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={fetchServicePrices}
            >
              Try Again
            </button>
          </div>
        ) : servicePrices.length > 0 ? (
          servicePrices.map((price) => (
            <div
              key={price.id}
              className={`offer-item d-md-flex align-items-center justify-content-between mb-2 ${selectedPrices.some((p) => p.id === price.id) ? 'bg-primary-light border-primary' : 'bg-white'}`}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedPrices.some(
                  (p) => p.id === price.id,
                )
                  ? '1px solid #0d6efd'
                  : '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '12px',
              }}
              onClick={() => togglePriceSelection(price)}
            >
              <div className="d-sm-flex align-items-center mb-2">
                <span className="avatar avatar-lg flex-shrink-0 me-2 mb-2">
                  {selectedPrices.some(
                    (p) => p.id === price.id,
                  ) ? (
                    <i className="fas fa-check-circle text-primary fs-4"></i>
                  ) : (
                    <i className="far fa-circle text-muted fs-4"></i>
                  )}
                </span>
                <div className="mb-2">
                  <h6 className="fs-16 fw-medium">
                    {price.service_price_for}
                  </h6>
                  <p className="fs-14 text-muted">
                    Original Price: &#8377;
                    {price.service_price_rate}
                  </p>
                </div>
              </div>
              <div className="pb-3">
                <h6 className="fs-16 fw-medium text-primary mb-0">
                  &#8377;{price.service_price_amount}
                </h6>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info">

            {message}
          </div>
        )}
      </div>
    </div>
    <div id="include" className="accordion-collapse collapse show">
      <div className="accordion-body border-0 p-0 pt-3">
        <div className="bg-light-200 p-3 br-10">
          <div className="d-flex gap-3">
            <button
              className="btn btn-primary flex-grow-1 py-3"
              onClick={() => {
                if (selectedPrices.length === 0) {
                  showNotification('Please select at least one service', 'error');
                  return;
                }
                selectedPrices.forEach(price => {
                  dispatch(addToCart({
                    id: price.id,
                    service_price_for: price.service_price_for,
                    service_price_rate: price.service_price_rate,
                    service_price_amount: price.service_price_amount,
                    service_id: state?.service_id,
                    service_name: state?.service_name,
                    service_sub_id: state?.service_sub_id,
                    service_sub_name: state?.service_sub_name
                  }));
                });
                showNotification('Service added to cart', 'success');
              }}
            >
              <i className="fas fa-cart-plus me-2"></i> Add to Cart
            </button>
            <button
              className="btn btn-outline-primary flex-grow-1 py-3"

              onClick={() => {
                if (selectedPrices.length === 0) {
                  showNotification('Please select at least one service', 'error');
                  return;
                }
                navigate('/cart')
                selectedPrices.forEach(price => {
                  dispatch(addToCart({
                    id: price.id,
                    service_price_for: price.service_price_for,
                    service_price_rate: price.service_price_rate,
                    service_price_amount: price.service_price_amount,
                    service_id: state?.service_id,
                    service_name: state?.service_name,
                    service_sub_id: state?.service_sub_id,
                    service_sub_name: state?.service_sub_name
                  }));
                });
                showNotification('Service added to cart', 'success');
              }}
            >
              <i className="fas fa-shopping-bag me-2"></i> Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>