export default function HeroSection() {
    return (
         <section className="hero-section">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-5 hero-content">
                    <h1 className="hero-title">Savor Authentic Flavors</h1>
                    <p className="hero-subtitle">
                        Experience the finest cuisine crafted with passion and fresh ingredients. 
                        Join us for an unforgettable dining experience.
                    </p>
                    <div className="d-flex gap-3">
                        <button className="btn btn-primary btn-cta">View Menu</button>
                        <button className="btn btn-outline-secondary btn-cta">Reserve a Table</button>
                    </div>
                </div>
                
                <div className="d-none d-md-block col-lg-6 hero-image-container mx-4">
                    <div className="hero-image-placeholder">
                        <img src="..\..\public\wooden-plate.png" alt="Wooden Plate" className="img-fluid hero-image " />
                        <img src="..\..\public\burger.png" alt="Burger" className="img-fluid hero-image " />
                    </div>
                </div>
            </div>
        </div>
    </section>

    )
}