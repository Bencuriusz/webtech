$(function () {
    const $carList = $('#carList');
    const $manufacturerList = $('#manufacturerList');
    let cars = [];
    let manufacturers = [];
    let pressed = 0;

    function addButton(e) {
        if (pressed == 0) {
            pressed = 1;
            let item = $(e.target);
            let type = item.data('type');
            let li;
            if (type == 'car') {
                $manufacturerOptions = selectOptions(item.find('.key_manufacturer').text());

                li = $('<form/>')
                    .addClass('menu-item')
                    .html('<div class="menu-item-column key_name"><input type="text" name="name" class="form-control" placeholder="Name" required /></div> <div class="menu-item-column key_consumption"><input type="number" name="consumption" class="form-control" placeholder="10" required />l/100km</div><div class="menu-item-column key_color"><input type="text" name="color" class="form-control" placeholder="Red" required></div><div class="menu-item-column key_manufacturer"><select name="manufacturer" required></select></div><div class="menu-item-column key_year"><input type="number" name="year" class="form-control" placeholder="2020"></div><div class="menu-item-column key_avaiable"><input type="number" name="avaiable" class="form-control" placeholder="Available" required /></div><div class="menu-item-column key_horsepower"><input type="number" name="horsepower" class="form-control" placeholder="40" required /></div><div class="menu-item-column"><button type="submit" class="save">&#128427;</button><button class="cancel" type="button">&#10006;</button> </div>')
                    .data('type', 'car')
                    .appendTo($carList);

                li.find('.key_manufacturer select').append($manufacturerOptions);
            }
            else if (type == 'manufacturer') {
                li = $('<form/>')
                    .addClass('menu-item')
                    .html('<div class="menu-item-column name"><input type="text" name="name" class="form-control" placeholder="Name" required /></div> <div class="menu-item-column founded"><input type="date"  name="founded" class="form-control" required /></div> <div class="menu-item-column country"><input type="text" name="country" class="form-control" placeholder="Country" required /></div> <div class="menu-item-column"> <button type="submit" class="save">&#128427;</button> <button class="cancel" type="button">&#10006;</button> </div>')
                    .data('type', 'manufacturer')
                    .appendTo($manufacturerList);
            }
            li.on('submit', submitFunction);
            $('.cancel').on('click', cancelButton);
        }
    }

    function modifyButton(e) {
        let item = $(e.target).closest("li");
        let key = item.data('key');
        let type = item.data('type');
        let li;
        if (type == 'car') {
            $manufacturerOptions = selectOptions(item.find('.key_manufacturer').text());

            li = $('<form/>')
                .addClass('menu-item')
                .html('<div class="menu-item-column key_name"><input type="text" name="name" class="form-control" value="' + item.find('.key_name').text() + '" required /></div> <div class="menu-item-column key_consumption"><input type="number" name="consumption" class="form-control" placeholder="10" value="' + item.find('.key_consumption').text() + '" required />l/100km</div><div class="menu-item-column key_color"><input type="text" name="color" class="form-control" value="' + item.find('.key_color').text() + '" required></div><div class="menu-item-column key_manufacturer"><select name="manufacturer" required></select></div><div class="menu-item-column key_year"><input type="number" name="year" class="form-control" placeholder="2020" value="' + item.find('.key_year').text() + '"></div><div class="menu-item-column key_avaiable"><input type="number" name="avaiable" class="form-control" placeholder="Available" value="' + item.find('.key_avaiable').text() + '" required /></div><div class="menu-item-column key_horsepower"><input type="number" name="horsepower" class="form-control" placeholder="40" value="' + item.find('.key_horsepower').text() + '" required /></div><div class="menu-item-column"><button type="submit" class="save">&#128427;</button><button class="cancel" type="button">&#10006;</button> </div>')
                .data('type', 'car')
                .data('key', key);

            li.find('.key_manufacturer select').append($manufacturerOptions);
        }
        else if (type == 'manufacturer') {
            li = $('<form/>')
                .addClass('menu-item')
                .html('<div class="menu-item-column key_name"><input type="text" name="name" class="form-control" placeholder="Name"  value="' + item.find('.key_name').text() + '"  required /></div> <div class="menu-item-column key_founded"><input type="date"  name="founded" class="form-control"  value="' + item.find('.key_founded').text() + '" required /></div> <div class="menu-item-column key_country"><input type="text" name="country" class="form-control" placeholder="Country"  value="' + item.find('.key_country').text() + '" required /></div> <div class="menu-item-column"> <button type="submit" class="save">&#128427;</button> <button class="cancel" type="button">&#10006;</button> </div>')
                .data('type', 'manufacturer')
                .data('key', key);
        }

        li.insertAfter(item);
        item.hide();

        li.on('submit', submitFunction);
        $('.cancel').on('click', function (e) {
            cancelButton(e, item);
        });
    }

    function cancelButton(e, originalItem) {
        let item = $(e.target).closest("form");
        let key = item.data('key');
        item.remove();
        if (originalItem) {
            originalItem.show();
        }
        pressed = 0;
    }

    function deleteButton(e) {
        let item = $(e.target).closest("li");
        let key = item.data('key');
        let type = item.data('type');
        if (type == 'car') {
            deleteCar(key).then(function () {
                item.remove();
            });
        } else if (type == 'manufacturer') {
            deleteManufacturer(key).then(function () {
                item.remove();
            });
        }
    }

    function submitFunction(e) {
        e.preventDefault();

        let item = $(e.target);

        let key = item.data('key');
        let type = item.data('type');
        let formData = item.serializeArray();
        let network_task;

        if (type == 'car') {
            let car = {
                _id: key || null,
                name: formData.find(i => i.name === 'name').value,
                consumption: formData.find(i => i.name === 'consumption').value,
                color: formData.find(i => i.name === 'color').value,
                manufacturer: formData.find(i => i.name === 'manufacturer').value,
                year: formData.find(i => i.name === 'year').value,
                avaiable: formData.find(i => i.name === 'avaiable').value,
                horsepower: formData.find(i => i.name === 'horsepower').value,
            }

            network_task = key ? updateCar(car) :
                createCar(car);
            network_task.then(function () {
                console.log('update complete')
                item.remove();
                getCars().then(function () {
                    updateDocuments();
                })
            })
        }
        else if (type == 'manufacturer') {
            let manufacturer = {
                _id: key || null,
                name: formData.find(i => i.name === 'name').value,
                founded: formData.find(i => i.name === 'founded').value,
                country: formData.find(i => i.name === 'country').value
            }
            network_task = key ? updateManufacturer(manufacturer) : createManufacturer(manufacturer);
            network_task.then(function () {
                item.remove();
                getManufacturers().then(function () {
                    updateDocuments();
                });
            })
        }
    }

    function getCars() {
        return new Promise(function (resolve, reject) {
            $.get("https://webtechcars.herokuapp.com/api/cars", function (data) {
                cars = data;
                resolve();
            });
        });

    }

    function getManufacturers() {
        return new Promise(function (resolve, reject) {
            $.get("https://webtechcars.herokuapp.com/api/manufacturers", function (data) {
                manufacturers = data;
                resolve();
            });
        });
    }

    function createCar(car) {
        return new Promise(function (resolve, reject) {
            let data = car;
            return $.post("https://webtechcars.herokuapp.com/api/cars", JSON.stringify(data), function (data) {
                console.log(data);
                cars.push(data);
                resolve();
                pressed = 0;
            });
        });
    };

    function createManufacturer(manufacturer) {
        return new Promise(function (resolve, reject) {
            let data = manufacturer;
            $.post("https://webtechcars.herokuapp.com/api/manufacturers", JSON.stringify(data), function (data) {
                console.log(data);
                manufacturers.push(data);
                resolve();
                pressed = 0;
            });
        });
    }

    function updateCar(car) {
        return new Promise(function (resolve, reject) {
            deleteCar(car._id).then(function () {
                createCar(car).then(function () {
                    resolve();
                });
            })
        });
    };

    function updateManufacturer(manufacturer) {
        return new Promise(function (resolve, reject) {
            deleteManufacturer(manufacturer._id).then(function () {
                createManufacturer(manufacturer).then(function () {
                    resolve();
                });
            })
        });
    }

    function deleteCar(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: 'https://webtechcars.herokuapp.com/api/cars/' + id,
                type: 'DELETE',
                success: function (data) {
                    let r = cars.findIndex(car => car._id === id);
                    if (r !== -1) {
                        cars.splice(r, 1);
                    }

                    resolve();

                },
                error: function () {
                    reject();
                }
            });
        });

    }

    function deleteManufacturer(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: 'https://webtechcars.herokuapp.com/api/manufacturers/' + id,
                type: 'DELETE',
                success: function (data) {
                    let r = manufacturers.findIndex(car => car._id === id);
                    if (r !== -1) {
                        manufacturers.splice(r, 1);
                    }

                    resolve();
                },
                error: function () {
                    reject();
                }
            });
        });
    }

    function selectOptions(selected_name) {
        let options = [];
        $.each(manufacturers, function (key, value) {
            let o = $('<option />')
                .data('key', value._id)
                .text(value.name);

            if (value.name === selected_name) {
                o.attr('selected', true);
            }

            options.push(o);
        });
        return options;
    }

    function updateDocuments() {
        $carList.html('');
        $manufacturerList.html('');

        $.each(cars, function (key, value) {
            let li = $('<li/>')
                .addClass('menu-item')
                .html('<div class="menu-item-column key_name">' + value.name + '</div> <div class="menu-item-column key_consumption">' + value.consumption + '</div> <div class="menu-item-column key_color">' + value.color + '</div> <div class="menu-item-column key_manufacturer">' + value.manufacturer + '</div> <div class="menu-item-column key_year">' + value.year + '</div> <div class="menu-item-column key_avaiable">' + value.avaiable + '</div> <div class="manu-item-column key_horsepower">' + value.horsepower + '</div ><div class="menu-item-column"> <button class="modify">&#9998;</button> <button class="delete">&#10006;</button> </div>')
                .data('key', value._id)
                .data('type', 'car')
                .appendTo($carList);
        });
        $.each(manufacturers, function (key, value) {
            let li = $('<li/>')
                .addClass('menu-item')
                .html('<div class="menu-item-column key_name">' + value.name + '</div> <div class="menu-item-column key_founded">' + value.founded + '</div> <div class="menu-item-column key_country">' + value.country + '</div> <div class="menu-item-column"> <button class="modify">&#9998;</button> <button class="delete">&#10006;</button> </div>')
                .data('key', value._id)
                .data('type', 'manufacturer')
                .appendTo($manufacturerList);
        })

        $(".delete").click(deleteButton);
        $(".modify").on('click', modifyButton);
    }

    $.ajaxSetup({
        contentType: "application/json; charset=utf-8",
    });
    Promise.all([getCars(),
    getManufacturers()]).then(function () {
        updateDocuments();
    });

    $('.add').on('click', addButton);
});