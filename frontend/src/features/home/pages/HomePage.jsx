import React from 'react';
import ProductSideBar from "../../products/components/ProductSidebar";
import ProductCard from "../../products/components/ProductCard";
import "./HomePage.scss";

const featuredSections = [
    {
        id: 'phones',
        title: 'Nổi bật - Điện thoại',
        items: [
            { id: 'p1', name: 'iPhone 14 Pro', thumbnail: 'https://via.placeholder.com/200x150?text=iPhone+14', price: 24990000, salePrice: 22990000, averageScore: 4.7, reviewsCount: 124 },
            { id: 'p2', name: 'Samsung Galaxy S23', thumbnail: 'https://via.placeholder.com/200x150?text=Galaxy+S23', price: 19990000, salePrice: 17990000, averageScore: 4.5, reviewsCount: 88 },
            { id: 'p3', name: 'Xiaomi 13', thumbnail: 'https://via.placeholder.com/200x150?text=Xiaomi+13', price: 13990000, salePrice: 12990000, averageScore: 4.4, reviewsCount: 56 }
        ]
    },
    {
        id: 'laptops',
        title: 'Nổi bật - Laptop',
        items: [
            { id: 'l1', name: 'Dell XPS 13', thumbnail: 'https://via.placeholder.com/200x150?text=Dell+XPS+13', price: 32990000, salePrice: 29990000, averageScore: 4.6, reviewsCount: 92 },
            { id: 'l2', name: 'MacBook Air M2', thumbnail: 'https://via.placeholder.com/200x150?text=MacBook+Air+M2', price: 34990000, salePrice: 32990000, averageScore: 4.8, reviewsCount: 210 },
            { id: 'l3', name: 'Acer Nitro 5', thumbnail: 'https://via.placeholder.com/200x150?text=Acer+Nitro+5', price: 21990000, salePrice: 19990000, averageScore: 4.3, reviewsCount: 61 }
        ]
    },
    {
        id: 'accessories',
        title: 'Nổi bật - Phụ kiện',
        items: [
            { id: 'a1', name: 'Tai nghe Bluetooth', thumbnail: 'https://via.placeholder.com/200x150?text=Headphones', price: 1290000, salePrice: 990000, averageScore: 4.2, reviewsCount: 34 },
            { id: 'a2', name: 'Sạc dự phòng 20000mAh', thumbnail: 'https://via.placeholder.com/200x150?text=Powerbank', price: 690000, salePrice: 499000, averageScore: 4.1, reviewsCount: 47 },
            { id: 'a3', name: 'Cáp sạc Type-C', thumbnail: 'https://via.placeholder.com/200x150?text=Type-C+Cable', price: 99000, salePrice: 79000, averageScore: 4.0, reviewsCount: 18 }
        ]
    }
];

function HomePage() {
    return (
        <div className="homepageLayout">
            <ProductSideBar />
            <div className="homepageContent">
                <h1>Trang chủ</h1>

                {featuredSections.map(section => (
                    <section className="featured-section" key={section.id}>
                        <h2 className="section-title">{section.title}</h2>
                        <div className="product-grid">
                            {section.items.map(item => (
                                <ProductCard product={item} key={item.id} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    )
}

export default HomePage;