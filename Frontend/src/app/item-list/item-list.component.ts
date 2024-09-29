import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnInit {
  items: Item[] | undefined;
  loading: boolean = true;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    try {
      this.loading = true;
      this.itemService.getAllItems().subscribe((item) => {
        this.items = item;
        this.loading = false;
      });
    } catch (error) {
      // Handle any database errors
      console.error(error);
      throw new Error('Error occurred while gettin all items');
    }
  }
}
