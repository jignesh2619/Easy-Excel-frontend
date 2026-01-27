export function DashboardPreviewSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-[#00A878]/5 to-gray-50 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#00A878]/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#00c98c]/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-[#00A878] to-gray-900 bg-clip-text text-transparent">
            From Messy Data to Clear Insights—Automatically
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how LazyExcel transforms your raw data into professional, interactive dashboards.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl hover:scale-[1.02] transition-smooth hover-lift">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] px-8 py-6 text-white">
              <h3 className="mb-2">Sales Dashboard</h3>
              <p className="text-white/90">Last updated: Nov 2025</p>
            </div>

            {/* Dashboard Content */}
            <div className="p-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center animate-fade-in-up group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
                  <p className="text-gray-600 mb-2 text-sm group-hover:text-gray-700 transition-colors">Total Revenue</p>
                  <p className="text-gray-900 text-2xl font-semibold group-hover:text-[#00A878] transition-colors">$124,583</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-[#00A878] text-sm">↑ 12.5%</span>
                  </div>
                </div>
                <div className="text-center animate-fade-in-up group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
                  <p className="text-gray-600 mb-2 text-sm group-hover:text-gray-700 transition-colors">Active Users</p>
                  <p className="text-gray-900 text-2xl font-semibold group-hover:text-[#00A878] transition-colors">8,432</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-[#00A878] text-sm">↑ 8.2%</span>
                  </div>
                </div>
                <div className="text-center animate-fade-in-up group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.3s' }}>
                  <p className="text-gray-600 mb-2 text-sm group-hover:text-gray-700 transition-colors">Conversion Rate</p>
                  <p className="text-gray-900 text-2xl font-semibold group-hover:text-[#00A878] transition-colors">24.8%</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-[#00A878] text-sm">↑ 3.1%</span>
                  </div>
                </div>
              </div>

              {/* Charts Area */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Bar Chart Mockup */}
                <div className="animate-fade-in-up group hover:scale-[1.02] transition-transform duration-300" style={{ animationDelay: '0.4s' }}>
                  <p className="text-gray-700 mb-4 font-medium group-hover:text-[#00A878] transition-colors">Monthly Revenue</p>
                  <div className="flex items-end justify-between gap-2 h-48">
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-110 transition-transform duration-300" style={{ height: "45%" }}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-110 transition-transform duration-300" style={{ height: "60%" }}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-110 transition-transform duration-300" style={{ height: "75%" }}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-110 transition-transform duration-300" style={{ height: "55%" }}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-110 transition-transform duration-300" style={{ height: "85%" }}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-110 transition-transform duration-300" style={{ height: "100%" }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-gray-500 text-sm">
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                  </div>
                </div>

                {/* Line Chart Mockup */}
                <div className="animate-fade-in-up group hover:scale-[1.02] transition-transform duration-300" style={{ animationDelay: '0.5s' }}>
                  <p className="text-gray-700 mb-4 font-medium group-hover:text-[#00A878] transition-colors">User Growth</p>
                  <div className="relative h-48">
                    <svg className="w-full h-full group-hover:scale-105 transition-transform duration-300" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <polyline
                        fill="none"
                        stroke="#00A878"
                        strokeWidth="3"
                        points="0,150 66,120 132,100 198,110 264,70 330,50 400,30"
                        className="group-hover:stroke-[#00c98c] transition-colors duration-300"
                      />
                      <polyline
                        fill="url(#gradient)"
                        stroke="none"
                        points="0,150 66,120 132,100 198,110 264,70 330,50 400,30 400,200 0,200"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: "#00A878", stopOpacity: 0.2 }} />
                          <stop offset="100%" style={{ stopColor: "#00A878", stopOpacity: 0 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex justify-between mt-2 text-gray-500 text-sm">
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}