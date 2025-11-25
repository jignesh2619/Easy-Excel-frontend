# Frontend-Backend Connection Guide

## ✅ Integration Complete!

Your frontend is now connected to the backend API.

## 🔗 Connection Details

- **Frontend**: Running on `http://localhost:3000` (or `http://localhost:5173`)
- **Backend API**: Running on `http://localhost:8000`
- **API Base URL**: Configured in `src/services/api.ts`

## 📁 Files Created/Updated

### 1. API Service (`src/services/api.ts`)
- Handles all backend API calls
- `processFile()` - Uploads file and processes with prompt
- `checkHealth()` - Checks backend health
- `downloadFile()` - Downloads processed files/charts

### 2. File Utils (`src/utils/fileUtils.ts`)
- File validation (type, size)
- File size formatting
- Error messages

### 3. Updated Components

#### `HeroSection.tsx`
- ✅ File upload with drag & drop
- ✅ Prompt input
- ✅ Process file functionality
- ✅ Error handling

#### `PromptToolSection.tsx`
- ✅ File upload button
- ✅ Prompt textarea
- ✅ Process file button
- ✅ Loading states
- ✅ Success/error messages
- ✅ Results display

#### `FileUploadSection.tsx` (New)
- Complete file upload component
- Drag & drop support
- File validation
- Results display with download buttons

## 🚀 How to Use

### 1. Start Backend (if not running)
```powershell
cd "C:\Users\manda\excel bot\backend"
py start_server.py
```

### 2. Start Frontend
```powershell
cd "C:\Users\manda\excel bot\Onepagelandingpagedesign-main\Onepagelandingpagedesign-main"
npm run dev
```

### 3. Use the Application

1. **Upload a File**:
   - Click "Upload Sheet" button
   - Or drag & drop a CSV/Excel file
   - Supported formats: `.csv`, `.xlsx`, `.xls`

2. **Enter a Prompt**:
   - Type your instruction (e.g., "Group by Region and sum Revenue")
   - Or click a template suggestion

3. **Process File**:
   - Click "Process File" button
   - Wait for processing (loading indicator shown)
   - Results will appear with download buttons

4. **Download Results**:
   - Processed Excel file downloads automatically
   - Chart image can be downloaded if generated

## 📋 Example Prompts

Try these prompts with your Excel files:

1. **"Group by Region and sum Revenue, create bar chart"**
2. **"Clean the data - remove duplicates and fix formatting"**
3. **"Show me summary statistics for Revenue and Quantity"**
4. **"Filter rows where Revenue > 20000 and create line chart"**
5. **"Find and report all missing values"**

## 🔧 Configuration

### API URL Configuration

The API URL is set in `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

To change it:
1. Create `.env` file in frontend root
2. Add: `VITE_API_URL=http://localhost:8000`

## 🐛 Troubleshooting

### CORS Errors
- Backend already configured with CORS middleware
- Should work out of the box

### Connection Issues
- Make sure backend is running on port 8000
- Check: http://localhost:8000/health

### File Upload Fails
- Check file size (max 50MB)
- Check file format (.csv, .xlsx, .xls)
- Check browser console for errors

### API Not Responding
- Verify backend is running
- Check backend logs for errors
- Verify Gemini API key is set

## ✅ Everything is Connected!

Your frontend can now:
- ✅ Upload Excel/CSV files
- ✅ Send prompts to backend
- ✅ Process files with AI
- ✅ Download processed files
- ✅ Download charts
- ✅ Display results

Enjoy your fully connected EasyExcel application! 🎉







