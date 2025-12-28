// Simple in-memory storage for testing
class Storage {
  constructor() {
    this.items = [];
    this.idCounter = 1;
  }

  save(item) {
    const newItem = {
      _id: this.idCounter++,
      ...item,
      uploadedAt: new Date().toISOString()
    };
    this.items.push(newItem);
    return Promise.resolve(newItem);
  }

  findAll() {
    return Promise.resolve([...this.items].reverse()); // Newest first
  }

  findById(id) {
    const item = this.items.find(item => item._id == id);
    return Promise.resolve(item || null);
  }

  count() {
    return Promise.resolve(this.items.length);
  }

  getStats() {
    const categories = {};
    this.items.forEach(item => {
      const category = item.prediction.class;
      categories[category] = (categories[category] || 0) + 1;
    });

    const byCategory = Object.entries(categories).map(([_id, count]) => ({
      _id,
      count,
      averageConfidence: 85 // Mock average
    }));

    return Promise.resolve({
      total: this.items.length,
      byCategory,
      recent: this.items.slice(-5).reverse() // Last 5 items
    });
  }

  delete(id) {
    const index = this.items.findIndex(item => item._id == id);
    if (index > -1) {
      this.items.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}

module.exports = new Storage();