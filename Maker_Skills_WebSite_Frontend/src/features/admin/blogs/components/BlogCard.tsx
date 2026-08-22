import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Blog } from '../blog';
import { getImageUrl } from '../../../../shared/utils/imageUtils';

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
  onDetail: (blog: Blog) => void;
  theme: 'light' | 'dark';
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete, onDetail, theme }) => {
  return (
    <div className={`p-6 rounded-2xl shadow-lg flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}> 
      <img
        src={getImageUrl(blog.cover) || '/placeholder-blog.png'}
        alt={blog.title}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />
      <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{blog.title}</h3>
      {blog.description && (
        <div className={`text-sm mb-4 line-clamp-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          dangerouslySetInnerHTML={{ __html: blog.description }} />
      )}
      <div className="flex space-x-2 mt-auto">
        <button
          onClick={() => onDetail(blog)}
          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-blue-400 hover:text-white hover:bg-gray-700' : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'}`}
        >
          <Eye className="h-5 w-5" />
        </button>
        <button
          onClick={() => onEdit(blog)}
          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(blog._id)}
          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'}`}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default BlogCard; 