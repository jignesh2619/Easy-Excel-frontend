# Meta Pixel Setup Guide

This guide will help you set up Meta (Facebook) Pixel tracking for your Lazy Excel application.

## Step 1: Get Your Meta Pixel ID

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel or create a new one
3. Copy your Pixel ID (it's a 15-16 digit number, e.g., `1234567890123456`)

## Step 2: Add Pixel ID to Environment Variables

### For Local Development:

1. Create a `.env` file in the `frontend-temp` directory (if it doesn't exist)
2. Add your Pixel ID:
   ```
   VITE_META_PIXEL_ID=your_pixel_id_here
   ```
   Example:
   ```
   VITE_META_PIXEL_ID=1234567890123456
   ```

### For Production (Vercel):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `VITE_META_PIXEL_ID`
   - **Value**: Your Pixel ID (e.g., `1234567890123456`)
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy your application for the changes to take effect

## Step 3: Verify Installation

After adding the Pixel ID and restarting your development server:

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Type `fbq` and press Enter
4. You should see the `fbq` function object (not `undefined`)
5. Check the **Network** tab for requests to `facebook.com/tr`

## Tracked Events

The following events are automatically tracked:

### Page View
- Tracked automatically on every page load

### User Registration
- **Event**: `CompleteRegistration` and `Lead`
- **Triggered**: When a user signs up via email or Google

### File Upload
- **Event**: `ViewContent` and `FileUpload`
- **Triggered**: When a user uploads an Excel file

### Subscription/Checkout
- **Event**: `InitiateCheckout`
- **Triggered**: When a user clicks to subscribe to a paid plan
- **Event**: `Subscribe` or `StartTrial`
- **Triggered**: When a user successfully subscribes (Pro/Enterprise) or starts free trial

## Manual Event Tracking

You can manually track custom events using the utility functions:

```typescript
import { trackMetaEvent, trackLead, trackPurchase } from '../utils/metaPixel';

// Track a custom event
trackMetaEvent('CustomEventName', {
  custom_parameter: 'value'
});

// Track a lead
trackLead({
  content_name: 'Contact Form Submission'
});

// Track a purchase
trackPurchase(29.99, 'USD', {
  content_name: 'Pro Plan'
});
```

## Available Tracking Functions

- `trackPageView()` - Track page view
- `trackSignUp(params?)` - Track user registration
- `trackPurchase(value, currency, params?)` - Track purchase
- `trackInitiateCheckout(params?)` - Track checkout initiation
- `trackAddToCart(params?)` - Track add to cart
- `trackViewContent(params?)` - Track content view
- `trackLead(params?)` - Track lead generation
- `trackStartTrial(params?)` - Track free trial start
- `trackSubscribe(params?)` - Track subscription
- `trackMetaEvent(eventName, params?)` - Track any custom event

## Troubleshooting

### Pixel not loading
- Check that `VITE_META_PIXEL_ID` is set correctly in your `.env` file
- Restart your development server after adding the environment variable
- Check browser console for any errors

### Events not showing in Events Manager
- Events may take a few minutes to appear in Facebook Events Manager
- Use Facebook Pixel Helper browser extension to debug in real-time
- Check that ad blockers are disabled for testing

### Testing in Development
- Meta Pixel works in development mode
- Use Facebook Pixel Helper extension to verify events are firing
- Check the Network tab for requests to `facebook.com/tr`

## Additional Resources

- [Meta Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
- [Facebook Events Manager](https://business.facebook.com/events_manager2)
- [Facebook Pixel Helper (Chrome Extension)](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
