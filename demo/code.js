var example1 = new ViewMatrix('.example-1', {

});

document.querySelector('.example-1-prev').addEventListener('click', function () { example1.inc(-1); });
document.querySelector('.example-1-next').addEventListener('click', function () { example1.inc(+1); });

// test battery, uncomment to see how it reacts
// setTimeout(function () { example1.inc(+1); }, 500);
// setTimeout(function () { example1.inc(-1); }, 1000);
// setTimeout(function () { example1.slide(0); }, 1500);
// setTimeout(function () { example1.slide(3); }, 2000);
// setTimeout(function () { example1.slide(0); }, 2500);

var example2 = new ViewMatrix('.example-2', {
	infinite: true
});

document.querySelector('.example-2-prev').addEventListener('click', function () { example2.inc(-1); });
document.querySelector('.example-2-next').addEventListener('click', function () { example2.inc(+1); });
