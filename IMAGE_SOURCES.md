# High-Quality 8K Image Sources for KarHubty

## Overview
The homepage now includes integrated high-quality images. Below are the current image URLs used and where to source premium 8K images.

## Current Images in HomePage

### 1. Hero Section Background
- **Current URL**: `https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=2560&q=80`
- **Purpose**: Main hero background showing premium cars
- **Location**: Hero section at the top

### 2. Features Section Images
- **Wide Selection**: `https://images.unsplash.com/photo-1549399542-7e3f8b83ad38?w=800&q=80`
- **Safe & Secure**: `https://images.unsplash.com/photo-1536366189519-52dd7f3dce8d?w=800&q=80`
- **24/7 Support**: `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80`

### 3. How It Works Section Images
- **Search Step**: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80`
- **Book Step**: `https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80`
- **Drive Step**: `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80`

### 4. CTA Section Background
- **Current URL**: `https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=2560&q=80`
- **Purpose**: "Ready to Hit the Road" background image

---

## Premium 8K Image Sources

### Free High-Quality Stock Photo Sites

#### 1. **Unsplash** (Recommended)
- **URL**: https://unsplash.com
- **Features**: 
  - 8K+ resolution images available
  - Free for commercial use
  - No attribution required
  - Search: "luxury cars", "rental", "driving", "car photography"
- **How to Use**: 
  - Download high resolution: Click image → Download → Download free
  - Select "Full Size" or use URL parameter `w=3840` for 4K+

#### 2. **Pexels**
- **URL**: https://www.pexels.com
- **Features**: 
  - 4K+ resolution available
  - Free commercial license
  - API available
- **Search Terms**: "luxury car", "rental car", "driving"

#### 3. **Pixabay**
- **URL**: https://pixabay.com
- **Features**:
  - 4K+ quality images
  - Commercial use allowed
  - No watermarks
- **Search Terms**: "car rental", "luxury vehicles", "driving experience"

#### 4. **Adobe Stock** (Premium)
- **URL**: https://stock.adobe.com
- **Features**:
  - Highest quality images
  - 8K resolution available
  - Professional licenses
- **Pricing**: Subscription based (~$9.99/month)

#### 5. **Shutterstock** (Premium)
- **URL**: https://www.shutterstock.com
- **Features**:
  - Extensive car/rental collection
  - 8K available
  - Commercial license included
- **Pricing**: Subscription or pay-per-image

#### 6. **Getty Images** (Premium)
- **URL**: https://www.gettyimages.com
- **Features**:
  - Professional-grade images
  - 8K+ available
  - Editorial and commercial licenses
- **Pricing**: Premium pricing

---

## Recommended 8K Car Rental Images

### Hero Section (Full width background)
**Best Options:**
- Scenic drive with premium cars
- Mountain road with SUV
- Sunset highway photography
- Modern garage/showroom

**Search queries:**
- "Premium car driving scenic road 8K"
- "Luxury rental car photography"
- "Highway driving sunset"

### Features Cards
**Best Options:**
- Feature 1: Variety of car models in showroom
- Feature 2: Security/safety inspection imagery
- Feature 3: Customer service/support center

### How It Works Section
**Best Options:**
- Step 1: Person browsing/searching on laptop
- Step 2: Calendar/booking interface or happy customer
- Step 3: Person driving/enjoying the car

### CTA Section Background
**Best Options:**
- Group of happy customers with cars
- Beautiful scenic location with car
- Luxury car in premium environment

---

## How to Update Images in Code

### To Replace Images in HomePage.js:

1. **Find the image URL** in `src/pages/HomePage.js`
2. **Replace the entire URL** with your new image URL
3. The format should be: `https://domain.com/image.jpg?w=2560&q=80`

**Example - Replace Hero Image:**
```javascript
// Before:
src="https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=2560&q=80"

// After:
src="https://images.unsplash.com/photo-YOUR-NEW-IMAGE-ID?w=2560&q=80"
```

### Image URL Parameters for Optimization:
- `w=2560` - Width in pixels (larger for better quality)
- `q=80` - Quality (1-100, higher is better)
- Example: `w=3840&q=90` for 4K+ quality

---

## Download & Host Locally (Optional)

If you want to host images on your own server:

1. **Download the image** from the stock site
2. **Place it in**: `/public/images/`
3. **Reference it in code**:
   ```javascript
   src="/images/hero-background.jpg"
   ```

**Pros:**
- Faster loading (no CDN dependency)
- Full control over the image
- Better SEO

**Cons:**
- Need to manage storage
- Need to handle image optimization

---

## Performance Tips for 8K Images

1. **Use responsive images**:
   ```html
   <img 
     src="image.jpg?w=1920&q=85"
     alt="Description"
     className="w-full h-full object-cover"
   />
   ```

2. **Add loading="lazy"** for below-the-fold images
3. **Use modern formats** (WebP) when possible
4. **Compress before uploading** using:
   - TinyPNG
   - ImageOptim
   - Squoosh

5. **Use CDN services**:
   - Cloudinary
   - Imgix
   - AWS CloudFront

---

## Current Image URLs Reference

| Section | Current URL | Size |
|---------|------------|------|
| Hero Background | `https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=2560&q=80` | 2560px |
| Feature 1 (Selection) | `https://images.unsplash.com/photo-1549399542-7e3f8b83ad38?w=800&q=80` | 800px |
| Feature 2 (Safe) | `https://images.unsplash.com/photo-1536366189519-52dd7f3dce8d?w=800&q=80` | 800px |
| Feature 3 (Support) | `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80` | 800px |
| How It Works 1 (Search) | `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80` | 800px |
| How It Works 2 (Book) | `https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80` | 800px |
| How It Works 3 (Drive) | `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80` | 800px |
| CTA Background | `https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=2560&q=80` | 2560px |

---

## Quick Start - 5 Best 8K Car Images (Free)

Copy these high-quality images from Unsplash:

1. **Hero - Luxury Car**: `https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=3840&q=90`
2. **Car Collection**: `https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=3840&q=90`
3. **Premium Vehicles**: `https://images.unsplash.com/photo-1486761058312-3bdd0c5297e9?w=3840&q=90`
4. **Road Trip**: `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=3840&q=90`
5. **Customer Experience**: `https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=3840&q=90`

---

## Need Help?

For the best results:
- Use 16:9 aspect ratio for full-width backgrounds
- Use 3:2 aspect ratio for feature cards
- Always test on mobile and desktop views
- Optimize for Core Web Vitals (LCP, CLS, FID)
