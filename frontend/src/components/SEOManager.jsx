import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../utils/api';

const SEOManager = () => {
  const location = useLocation();

  useEffect(() => {
    const updateSEO = async () => {
      const currentPath = location.pathname;
      try {
        const res = await API.get(`cms/seo/match_path/?path=${encodeURIComponent(currentPath)}`);
        const data = res.data;

        // 1. Update Document Title
        document.title = data.title || 'ROOTSIP Partners | Elite IP Rights Legal Counsel';

        // Helper to set or create meta tag
        const setMetaTag = (attrName, attrValue, content) => {
          let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
          if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attrName, attrValue);
            document.head.appendChild(element);
          }
          element.setAttribute('content', content || '');
        };

        // Helper to set or create link tag
        const setLinkTag = (rel, href) => {
          let element = document.querySelector(`link[rel="${rel}"]`);
          if (!element) {
            element = document.createElement('link');
            element.setAttribute('rel', rel);
            document.head.appendChild(element);
          }
          element.setAttribute('href', href || '');
        };

        // 2. Meta Description
        setMetaTag('name', 'description', data.meta_description);

        // 3. Meta Keywords
        setMetaTag('name', 'keywords', data.keywords);

        // 4. OpenGraph Tags
        setMetaTag('property', 'og:title', data.title);
        setMetaTag('property', 'og:description', data.meta_description);
        setMetaTag('property', 'og:type', 'website');
        setMetaTag('property', 'og:url', window.location.href);
        if (data.og_image) {
          setMetaTag('property', 'og:image', data.og_image);
        }

        // 5. Canonical link
        const canonical = data.canonical_url || window.location.href;
        setLinkTag('canonical', canonical);

        // 6. JSON-LD Structured Data Schema
        let jsonLdScript = document.getElementById('json-ld-seo-schema');
        if (!jsonLdScript) {
          jsonLdScript = document.createElement('script');
          jsonLdScript.id = 'json-ld-seo-schema';
          jsonLdScript.type = 'application/ld+json';
          document.head.appendChild(jsonLdScript);
        }

        // Build dynamic schema structure based on routing path
        let schemaObject = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": data.title,
          "description": data.meta_description,
          "url": window.location.href
        };

        // Customize schema based on route patterns
        if (currentPath === '/') {
          // LegalService Schema
          schemaObject = {
            "@context": "https://schema.org",
            "@type": "LegalService",
            "name": "ROOTSIP Partners",
            "description": data.meta_description,
            "url": "https://www.rootsip.com",
            "logo": "https://www.rootsip.com/logo.png",
            "telephone": "+91 22 5543-0980",
            "email": "consult@rootsip.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Level 14, Nariman Point",
              "addressLocality": "Mumbai",
              "addressRegion": "Maharashtra",
              "postalCode": "400021",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://linkedin.com/company/rootsip",
              "https://twitter.com/rootsip"
            ]
          };
        } else if (currentPath.startsWith('/services/')) {
          // Service / Product Schema
          schemaObject = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": data.title,
            "description": data.meta_description,
            "provider": {
              "@type": "LegalService",
              "name": "ROOTSIP Partners",
              "url": "https://www.rootsip.com"
            }
          };
        } else if (currentPath.startsWith('/blog/')) {
          // BlogPosting Schema
          schemaObject = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": data.title,
            "description": data.meta_description,
            "url": window.location.href,
            "author": {
              "@type": "Organization",
              "name": "ROOTSIP Partners"
            },
            "publisher": {
              "@type": "LegalService",
              "name": "ROOTSIP Partners",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.rootsip.com/logo.png"
              }
            }
          };
        }

        jsonLdScript.text = JSON.stringify(schemaObject, null, 2);

      } catch (err) {
        console.error('SEO configuration fetch error:', err);
      }
    };

    updateSEO();
  }, [location]);

  return null; // pure behavior component
};

export default SEOManager;
