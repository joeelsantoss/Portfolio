import './style.css'

// tipos sencillos para trabajar con el JSON de ejemplo
interface Post { userId: number; id: number; title: string; body: string; }
interface User { id: number; name: string; username: string; }
interface Comment { postId: number; id: number; name: string; email: string; body: string; }

// función genérica que devuelve una promesa con el JSON de la URL indicada
// puede usarse con cualquier tipo mediante parámetros de tipo
function getPage<T>(url: string, opts?: RequestInit): Promise<T> {
  return fetch(url, opts)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Error al obtener ' + url);
      }
      // forzamos el tipo adecuado
      return response.json() as Promise<T>;
    });
}

// mostrar algunos posts de JSONPlaceholder
function loadData() {
  // pedimos posts, usuarios y comentarios
  Promise.all([
    getPage<Post[]>('https://jsonplaceholder.typicode.com/posts'),
    getPage<User[]>('https://jsonplaceholder.typicode.com/users'),
    getPage<Comment[]>('https://jsonplaceholder.typicode.com/comments'),
  ])
    .then(function (results: [Post[], User[], Comment[]]) {
      let posts = results[0];
      let users = results[1];
      let comments = results[2];
      // mapa postId -> cantidad de comentarios
      let commentCount: { [key: number]: number } = {};
      comments.forEach(function (c) {
        commentCount[c.postId] = (commentCount[c.postId] || 0) + 1;
      });
      let app = document.querySelector('#app');
      if (!app) return;
      // limpiamos cualquier contenido previo antes de mostrar los posts
      let html = '<h2>Posts de demostración</h2>';
      // solo primeros 5
      for (let i = 0; i < 5 && i < posts.length; i++) {
        let post = posts[i];
        let user = users.find(function (u) {
          return u.id === post.userId;
        }) || {} as User;
        // avatar con API actual
        let avatar =
          'https://api.dicebear.com/9.x/avataaars/svg?seed=' +
          encodeURIComponent(user.username || 'anon');
        let nCom = commentCount[post.id] || 0;
        html +=
          '<div class="post">' +
          '<img class="avatar" src="' + avatar + '"/>' +
          '<div class="content"><strong>' +
          (user.name || 'Desconocido') +
          '</strong><p>' + post.body + '</p>' +
          '<div class="com-count">' + nCom + ' comentarios</div>' +
          '</div>' +
          '</div>';
      }
      app.innerHTML = html;
    })
    .catch(function (err) {
      console.error('error', err);
    });
}

// iniciamos la carga al arrancar
loadData();

