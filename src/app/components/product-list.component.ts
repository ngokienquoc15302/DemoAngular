import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ProductService]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  
  // Form data
  showForm = false;
  isEditing = false;
  editingId: number | null = null;
  formData = {
    name: '',
    price: 0,
    description: '',
    category: ''
  };

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    console.log('Loading products...');
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Data received:', data);
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Không thể tải dữ liệu sản phẩm: ' + err.message;
        this.loading = false;
      }
    });
  }

  showAddForm(): void {
    this.showForm = true;
    this.isEditing = false;
    this.editingId = null;
    this.resetForm();
  }

  showEditForm(product: Product): void {
    this.showForm = true;
    this.isEditing = true;
    this.editingId = product.id;
    this.formData = {
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category
    };
  }

  hideForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      name: '',
      price: 0,
      description: '',
      category: ''
    };
  }

  onSubmit(): void {
    if (this.isEditing && this.editingId) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct(): void {
    this.productService.createProduct(this.formData).subscribe({
      next: (newProduct) => {
        this.products.push(newProduct);
        this.hideForm();
        alert('Thêm sản phẩm thành công!');
      },
      error: (err) => {
        console.error('Error creating product:', err);
        alert('Lỗi khi thêm sản phẩm: ' + err.message);
      }
    });
  }

  updateProduct(): void {
  if (!this.editingId) return;
  
  // Tạo object với đầy đủ thông tin bao gồm ID
  const productToUpdate = {
    id: this.editingId,  // Thêm ID vào payload
    name: this.formData.name.trim(),  // Trim để loại bỏ khoảng trắng
    price: Number(this.formData.price),  // Đảm bảo price là number
    description: this.formData.description.trim(),
    category: this.formData.category.trim()
  };

  console.log('Updating product with data:', productToUpdate); // Debug log

  this.productService.updateProduct(this.editingId, productToUpdate).subscribe({
    next: (updatedProduct) => {
      const index = this.products.findIndex(p => p.id === this.editingId);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
      this.loadProducts();
      this.hideForm();
      alert('Cập nhật sản phẩm thành công!');
    },
    error: (err) => {
      console.error('Error updating product:', err);
      console.error('Error details:', err.error); // Log chi tiết lỗi từ server
      alert('Lỗi khi cập nhật sản phẩm: ' + (err.error?.message || err.message));
    }
  });
}

  deleteProduct(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          alert('Xóa sản phẩm thành công!');
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Lỗi khi xóa sản phẩm: ' + err.message);
        }
      });
    }
  }
}