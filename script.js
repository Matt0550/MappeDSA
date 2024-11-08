function appendPost(title, description, link) {
    $('#posts').append(`
        <div class="bg-gray-700 p-4 rounded-lg">
            <h3 class="text-xl font-bold mb-2">${title}</h3>
            <p class="text-gray-400">${description}</p>
        </div>
    `);
}

function appendCategory(name, link) {
    $('#categories').append(`
        <span class="px-3 py-1 rounded-full border border-gray-600 text-gray-300 text-xs">${name}</span>
    `);
}

function searchPosts() {
    // open in a new tab
    window.open('https://mappedsa.altervista.org/?s=' + $('#search').val(), '_blank');
    $('#search').val('');

    $('#not-found').show();

}
// On document ready
$(document).ready(function() {
    fetch('https://mappedsa.altervista.org/wp-json/wp/v2/posts?per_page=4')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(post => {
            appendPost(post.title.rendered, post.yoast_head_json.og_description);
        });
    });

    fetch('https://mappedsa.altervista.org/wp-json/wp/v2/categories')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(category => {
            appendCategory(category.name);
        });
    });

    // on enter key press or focus out
    $('#search').on('keypress', function(e) {
        if(e.which === 13) {
            searchPosts();
        }
    });
});