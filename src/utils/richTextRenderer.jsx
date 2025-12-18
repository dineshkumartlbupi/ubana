// Rich Text Content Renderer Utility
// This utility handles rendering of Payload CMS rich text content

import React from 'react';
import { getImageUrl, handleImageError, getApiBase } from './imageUtils.jsx';

export function renderRichTextContent(content) {
  if (!content) return null;
  
  // If content is a string, render it directly
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  
  // If content is a rich text object with root property
  if (content.root && content.root.children) {
    return renderRichTextNodes(content.root.children);
  }
  
  // If content is an array of nodes
  if (Array.isArray(content)) {
    return renderRichTextNodes(content);
  }
  
  // Fallback: try to render as string
  return <div>{String(content)}</div>;
}

// Render rich text nodes recursively
export function renderRichTextNodes(nodes) {
  if (!Array.isArray(nodes)) return null;
  
  return nodes.map((node, index) => {
    if (!node) return null;
    
    // Handle different node types
    switch (node.type) {
      case 'heading':
        const HeadingTag = `h${node.tag || 2}`;
        const headingId = node.children
          ?.map(child => child.text || '')
          .join('')
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        return (
          <HeadingTag 
            key={index} 
            id={headingId}
            className={`font-semibold text-white mb-4 mt-6 ${
              node.tag === 2 ? 'text-2xl' : 
              node.tag === 3 ? 'text-xl' : 
              node.tag === 4 ? 'text-lg' : 'text-lg'
            }`}
          >
            {renderRichTextNodes(node.children)}
          </HeadingTag>
        );
        
      case 'paragraph':
        // Check if paragraph is empty (only contains line break or whitespace)
        const hasContent = node.children && node.children.some(child => 
          child.text && child.text.trim() !== '' || 
          (child.type !== 'text' && child.children)
        );
        
        if (!hasContent) {
          return <br key={index} className="mb-2" />;
        }
        
        return (
          <p key={index} className="mb-4 leading-relaxed text-blue-100/90">
            {renderRichTextNodes(node.children)}
          </p>
        );
        
      case 'list':
        const ListTag = node.listType === 'bullet' ? 'ul' : 'ol';
        const listClass = node.listType === 'bullet' 
          ? 'list-disc ml-6 space-y-2' 
          : 'list-decimal ml-6 space-y-2';
        return (
          <ListTag key={index} className={`mb-4 ${listClass}`}>
            {renderRichTextNodes(node.children)}
          </ListTag>
        );
        
      case 'listitem':
        return (
          <li key={index} className="mb-1 leading-relaxed">
            {renderRichTextNodes(node.children)}
          </li>
        );
        
      case 'text':
        const textContent = node.text || '';
        
        // Handle format bitmask (Payload lexical editor format)
        // Format: 1 = bold, 2 = italic, 4 = underline, 8 = strikethrough, 16 = code
        const format = node.format || 0;
        const isBold = node.bold || (format & 1) !== 0;
        const isItalic = node.italic || (format & 2) !== 0;
        const isUnderline = node.underline || (format & 4) !== 0;
        const isStrikethrough = node.strikethrough || (format & 8) !== 0;
        const isCode = node.code || (format & 16) !== 0;
        
        // Handle line breaks
        const renderTextWithBreaks = (text) => {
          if (!text.includes('\n')) return text;
          return text.split('\n').map((line, lineIndex, array) => (
            <React.Fragment key={lineIndex}>
              {line}
              {lineIndex < array.length - 1 && <br />}
            </React.Fragment>
          ));
        };
        
        let content = renderTextWithBreaks(textContent);
        
        // Apply formatting in correct order (innermost to outermost)
        if (isCode) {
          content = (
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-blue-200">
              {content}
            </code>
          );
        }
        
        if (isBold && isItalic) {
          content = <strong><em>{content}</em></strong>;
        } else if (isBold) {
          content = <strong>{content}</strong>;
        } else if (isItalic) {
          content = <em>{content}</em>;
        }
        
        if (isUnderline) {
          content = <u>{content}</u>;
        }
        
        if (isStrikethrough) {
          content = <del>{content}</del>;
        }
        
        return <span key={index}>{content}</span>;
        
      case 'link':
        const linkUrl = node.url || node.fields?.url || node.href;
        return (
          <a 
            key={index} 
            href={linkUrl} 
            target={node.newTab ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {node.children ? renderRichTextNodes(node.children) : (node.text || linkUrl)}
          </a>
        );
        
      case 'upload':
        // Handle different upload node structures from Payload CMS
        let imageUrl = null;
        let altText = 'Image';
        
        // Check if value is a populated media object
        if (node.value) {
          if (typeof node.value === 'object' && node.value.url) {
            imageUrl = node.value.url;
            altText = node.value.alt || node.value.filename || 'Image';
          } else if (typeof node.value === 'string') {
            // If value is just an ID, construct URL (shouldn't happen with depth, but handle it)
            imageUrl = `${getApiBase()}/api/media/file/${node.value}`;
          }
        }
        
        // Fallback: check fields property or direct url
        if (!imageUrl) {
          imageUrl = node.fields?.url || node.url;
          altText = node.fields?.alt || node.alt || node.value?.alt || 'Image';
        }
        
        if (!imageUrl) return null;
        
        return (
          <div key={index} className="my-8">
            <img 
              src={getImageUrl(imageUrl)}
              alt={altText}
              className="max-w-full h-auto rounded-lg"
              onError={handleImageError}
            />
          </div>
        );
        
      case 'image':
        const imgUrl = node.src || node.url;
        
        return (
          <img 
            key={index}
            src={getImageUrl(imgUrl)}
            alt={node.alt || 'Image'}
            className="max-w-full h-auto rounded-lg my-4"
            onError={handleImageError}
          />
        );
        
      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
            {renderRichTextNodes(node.children)}
          </blockquote>
        );
        
      case 'code':
        return (
          <code key={index} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {node.text}
          </code>
        );
        
      default:
        // For unknown node types, try to render children
        if (node.children) {
          return <span key={index}>{renderRichTextNodes(node.children)}</span>;
        }
        return <span key={index}>{node.text || ''}</span>;
    }
  });
}

// Helper function to extract plain text from rich text content
export function extractPlainText(content) {
  if (!content) return '';
  
  if (typeof content === 'string') {
    return content;
  }
  
  if (content.root && content.root.children) {
    return extractTextFromNodes(content.root.children);
  }
  
  if (Array.isArray(content)) {
    return extractTextFromNodes(content);
  }
  
  return String(content);
}

function extractTextFromNodes(nodes) {
  if (!Array.isArray(nodes)) return '';
  
  return nodes.map(node => {
    if (!node) return '';
    
    if (node.text) {
      return node.text;
    }
    
    if (node.children) {
      return extractTextFromNodes(node.children);
    }
    
    return '';
  }).join('');
}
