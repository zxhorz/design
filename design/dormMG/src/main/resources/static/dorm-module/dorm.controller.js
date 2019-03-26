(function (angular, $) {
	'use strict';
	var app = angular.module('dormModule', [])
		.controller('dormController', function ($scope, $state, $compile, $http,$modal) {
			//	    var data = [];

			var alreadyReady = false; // The ready function is being called twice on page load.
			var initTable = $("#tableEmailsList").DataTable({
				"dom": '<"listtable"fit>pl',
				"responsive": true,
				"oLanguage": {
					"sEmptyTable": "没有记录",
					"sInfo": "共有 _TOTAL_ 项，正在展示第 _START_ 到 _END_ 项",
					"sInfoEmpty": "无记录",
					"sInfoFiltered": "(从 _MAX_ 条中筛选)",
					"sInfoPostFix": "",
					"sInfoThousands": ",",
					"sLengthMenu": "每页显示 _MENU_ 条",
					"sLoadingRecords": "加载中...",
					"sProcessing": "处理中...",
					"sSearch": "",
					"sZeroRecords": "没有记录",
					"oPaginate": {
						"sFirst": "最初的",
						"sLast": "最后的",
						"sNext": "下一页",
						"sPrevious": "上一页"
					}
				},
				"pageLength": 10,
				"order": [
					[0, "asc"]
				],
				"lengthMenu": [
					[10, 25, 50, -1],
					[10, 25, 50, "所有"]
				],
				"aoColumnDefs": [{
					"bSortable": false,
					"aTargets": [-1]
				}],
				"stateSave": true,
				"ajax": "/dorm/dormList",
				"columns": [{
						"data": "id"
					},
					{
						"data": null,
						"render": function (data, type, row, meta) {
							var html = data['volume'] - data['remain'];
							html = "<a href='#' ng-click='openDorm($event)'>"+html+" </a>"
							return html;
						},
                        "fnCreatedCell": function (td, cellData, rowData, row, col) {
                        	$compile(td)($scope);
                        }
					},
					{
						"data": "remain"
					},
					{
						"data": null,
						"render": function (data, type, row, meta) {
							var html = "<button class='btn btn-success' ng-click = dormDelete(" + data['id'] + ")>删除</button>"
							return html;
						},
						"fnCreatedCell": function (td, cellData, rowData, row, col) {
							$compile(td)($scope);
						}
					}
				],
				"rowCallback": function (row, data) {
//					$('td:eq(0)', row).on('click', function () {
//						$scope.viewDorm(data);
//					});
//					$('td:eq(1)', row).on('click', function () {
//						$scope.viewDorm(data);
//					});
				}
			});
			$(".dataTables_filter input").attr("placeholder", "输入要搜索的内容...");

			alreadyReady = true;

			var table = $('#tableEmailsList').removeClass('hidden').DataTable();
			table.order(0, 'asc');
			table.draw();
			$('#tableLoading').addClass('hidden');

			var table = $('#tableEmailsList').DataTable();

			$scope.openDorm = function ($event) {
//			    var data = table.row($event.target.parentElement).data();
				// //                var data = table.row(this.parentElement).data();
				//                 $state.go('notice/view', {
				//                     notice: data
				//                 })
				//                 //            openModal("/xx",{},"title",200,5,5  )
			}

			$scope.addDorm = function () {
				$state.go('editor');
			}

			$scope.dormDelete = function (id) {
				$http({
					method: 'GET',
					url: '/dorm/dormDelete',
					params: {
						'id': id
					}
				}).success(function (data) {
					if (data.message === 'S') {
						initTable.ajax.reload();
					} else {
						$scope.onModel.modelShow('error',data.data);
					}
				}).error(function (data) {
					$scope.onModel.modelShow('error');
				});
			}

			$scope.openDorm = function ($event) {
			    var data = table.row($event.target.parentElement.parentElement).data();
				$modal.open({
					backdrop: 'static',
					templateUrl: 'dorm-module/dorm.student.html',
					controller: 'dormStudentCtrl',
					resolve: {
						students: function() {
						    return data['students']
						}
					}
				})
			}

		}).controller('dormStudentCtrl', function ($scope, $state,$modalInstance, $http, students) {
            $scope.close = function () {
                $modalInstance.close();
            }
            if(students){
                $scope.students=students;
            }
		});


})(angular, $);