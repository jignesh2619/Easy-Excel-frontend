import React from "react";

export function ProductHuntSection() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <a 
        href="https://www.producthunt.com/products/easyexcel/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-easyexcel" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <img 
          src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1132852&theme=light" 
          alt="EasyExcel - Clean sheets and build dashboards with one click | Product Hunt" 
          style={{ width: '250px', height: '54px' }} 
          width="250" 
          height="54" 
        />
      </a>
    </section>
  );
}

