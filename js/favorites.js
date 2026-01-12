
function removeFavorite(cakeId) {
    if (confirm("Are you sure you want to remove this item from your favorites?")) {
        fetch('php/remove_favorite.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'cake_id': cakeId
            })
        })
        .then(response => response.text())
        .then(result => {
            if (result === 'success') {
                
                location.reload();
            } else {
                alert("Failed to remove the item. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}
