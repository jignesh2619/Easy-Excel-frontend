# 🚀 Quick Start Guide - EasyExcel Frontend-Backend Connection

## ✅ Setup Complete!

Your frontend and backend are now connected and ready to use!

## 🎯 Quick Start (3 Steps)

### 1. Start Backend Server
Open a terminal and run:
```powershell
cd "C:\Users\manda\excel bot\backend"
py start_server.py
```

You should see:
- ✅ Gemini API Key found!
- ✅ Starting EasyExcel Backend Server...
- ✅ Server running at http://localhost:8000

### 2. Start Frontend
Open another terminal and run:
```powershell
cd "C:\Users\manda\excel bot\Onepagelandingpagedesign-main\Onepagelandingpagedesign-main"
npm run dev
```

You should see:
- ✅ Vite dev server running
- ✅ Open http://localhost:3000 (or 5173)

### 3. Use the App!
1. Go to http://localhost:3000 in your browser
2. Upload an Excel/CSV file
3. Enter a prompt
4. Click "Process File"
5. Download your results!

## 📋 What's Connected

### ✅ Frontend Features:
- File upload with drag & drop
- Prompt input with templates
- Real-time processing status
- Results display
- Download buttons for processed files & charts

### ✅ Backend Features:
- File validation
- AI-powered prompt interpretation (Gemini)
- Excel/CSV processing
- Chart generation
- File download endpoints

## 🔗 API Endpoints

All endpoints are accessible at: `http://localhost:8000`

- `GET /health` - Health check
- `GET /` - API info
- `POST /process-file` - Process Excel file with prompt
- `GET /docs` - Interactive API documentation

## 📝 Example Usage

### Upload & Process:
1. **Select File**: Click "Upload Sheet" or drag & drop
2. **Enter Prompt**: Type something like:
   - "Group by Region and sum Revenue, create bar chart"
   - "Remove duplicates and clean formatting"
   - "Show me summary statistics"
3. **Process**: Click "Process File"
4. **Download**: Files automatically download when ready!

## 🐛 Troubleshooting

### Backend Not Running?
- Check if port 8000 is in use
- Verify Python is running: `py --version`
- Check backend logs for errors

### Frontend Can't Connect?
- Make sure backend is running on port 8000
- Check browser console for errors
- Verify API URL in `src/services/api.ts`

### File Upload Fails?
- Check file size (max 50MB)
- Check file format (.csv, .xlsx, .xls)
- Check browser console for errors

### Processing Fails?
- Verify Gemini API key is set in backend `.env`
- Check backend logs for errors
- Try a simpler prompt first

## ✅ Everything is Ready!

Your EasyExcel application is fully functional:
- ✅ Backend running
- ✅ Frontend connected
- ✅ File upload working
- ✅ AI processing ready
- ✅ Results download ready

**Happy processing!** 🎉







