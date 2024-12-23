document.addEventListener('DOMContentLoaded', function () {
	feather.replace()

	const menu = document.getElementById('menu')
	const listMenu = document.getElementById('list-menu')

	menu.addEventListener('click', function () {
		listMenu.classList.toggle('close')
	})
})
