
function appendCategory(name, link) {
    $('#categories').append(`
        <span class="px-3 py-1 rounded-full border border-gray-600 text-gray-300 text-xs">${name}</span>
    `);
}

function searchPosts() {
    let search = $('#search').val();
    
    // Utm
    search = search + '?utm_source=mappedsa_it&utm_medium=web&utm_campaign=search';
    // open in a new tab
    window.open('https://mappedsa.altervista.org/?s=' + search, '_blank');
    $('#search').val('');

    $('#not-found').show();

}

function appendPost(title, description, link) {
    link = link + '?utm_source=mappedsa_it&utm_medium=web&utm_campaign=homepage';
    const postHTML = $(`
        <div class="post hidden bg-gray-700 p-4 rounded-lg hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out" onclick="window.open('${link}', '_blank')">
            <h3 class="text-xl font-bold mb-2">${title}</h3>
            <p class="text-gray-400">${description}</p>
        </div>
    `);
    $('#posts').append(postHTML);
    return postHTML; // Restituisco il riferimento al nuovo post
}

fetch('https://mappedsa.altervista.org/wp-json/wp/v2/posts?per_page=4')
.then(response => response.json())
.then(data => {
    data.forEach((post, index) => {
        const newPost = appendPost(post.title.rendered, post.yoast_head_json.og_description, post.link);
        // Rimuove solo uno skeleton specifico alla volta
        $(`.loading-post:eq(${index})`).fadeOut(() => {
            
            newPost.fadeIn(); // Mostra il post dopo che lo scheletro è scomparso
        });
    });
});

fetch('https://mappedsa.altervista.org/wp-json/wp/v2/categories')
.then(response => response.json())
.then(data => {
    console.log(data);
    data.forEach(category => {
        appendCategory(category.name);
    });

    $('#categories').fadeIn();
});

// on enter key press or focus out
$('#search').on('keypress', function(e) {
    if(e.which === 13) {
        searchPosts();
    }
});
