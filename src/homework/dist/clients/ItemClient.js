// Create an ItemClient class here. This is what makes requests to your express server (your own custom API!)
class ItemClient{
    constructor(){
    }
    async createItem(item) {
      
        // $('body').loadingModal({
        //   text:'Loading...'  
        // });   
        const response = await fetch("/item", {
          method: "post",
          body: JSON.stringify({ item }),
          headers: { "Content-Type": "application/json" },
        });
        if (response.status == 201) {
          // $('body').loadingModal('hide');
          // toastr.success('Task Created Successfully')
          return await response.json();
        }
      }
    
      async fetchItems() {
        // $('body').loadingModal({
        //   text:'Loading...'  
        //  });   
        const response = await fetch("/item", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
    
        if (response.status != 200) {
          // $('body').loadingModal('hide');
          throw new Error(" Error fetching items");
        }
    
        const data = await response.json();
        // $('body').loadingModal('hide');
        // toastr.success('Tasks Fetched Successfully')
        return data;
      }
    
      async deleteItem(itemId) {
        try {
          // $('body').loadingModal({
          //   text:'Loading...'  
          //  });   
           await fetch(`/item/${itemId}`, {
            method: "delete",
            headers: { "Content-Type": "application/json" },
          });
          // $('body').loadingModal('hide');
          // toastr.success('Task Deleted Successfully')
        } catch (err) {
          // $('body').loadingModal('hide');
          // toastr.error('Failed To Delete Item')
          throw new Error("failed to delete item");
        }
      }
    
    async deleteAllItems()
    {
        try {
          // $('body').loadingModal({
          //   text:'Loading...'  
          //  });   
            await fetch('/item' ,{
             method: "delete",
             headers: { "Content-Type": "application/json" },
           });
          //  $('body').loadingModal('hide');
          //  toastr.success('Tasks Deleted Successfully')
         } catch (err) {
          // $('body').loadingModal('hide');
          // toastr.error('Failed To Delete Items')
           throw new Error("failed to delete all items ");
         }
       }

    async sortItems()
    {
        try {
          // document.getElementById('my-ul').innerHTML = '';
            // $('body').loadingModal({
            //  text:'Loading...'  
            // });   
            const response = await fetch('/item/sort' ,{
             method: "get",
             headers: { "Content-Type": "application/json" },
            });

           if (response.status != 200) {
              // $('body').loadingModal('hide');
              throw new Error(" Error sorting items");
            }
      
          const data = await response.json();
          // toastr.success('Tasks Sorted Successfully')
          return data;
         } catch (err) {
          console.log(err)
          // $('body').loadingModal('hide');
          // toastr.error('Failed To Sort Items')
           throw new Error("failed to sort Items ");
         }
    }

    async updateStatus(id,status){
      await fetch(`/item/${id}`,{
        method: "PATCH"
      });
    }
}