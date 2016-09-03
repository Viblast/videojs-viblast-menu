(function() {

	var videojs = window.videojs;

	(function(window, videojs) {

		var MenuItem = videojs.getComponent('MenuItem');
		var ViblastQualityItem = videojs.extend(MenuItem, {
			constructor : function(player, options) {

				var createQualityLabel = options.customLabel && (options.customLabel[options["viblastQualityStreamtype"]+"Stream"] || options.customLabel['default']);
				if (typeof createQualityLabel != 'function') {
					createQualityLabel = this.createLabel;
				} 
				options.label = createQualityLabel(options.quality, options.index);
				options.selectable = true;
				
				MenuItem.call(this, player, options);

				var this_ = this;
				player.on("quality-changed", function(event, data) {

					if (data.data === this_.options_.quality) {
						this_.selected(true);
					} else {
						this_.selected(false);
					}
				});
			}
		});
		
		ViblastQualityItem.prototype.createLabel = function (quality, index) {
			//custom generated, not a real quality
			if (quality === 'auto') {
				return quality;
			}
			if (!isNaN(quality.bandwidth)) {
				return quality.bandwidth/1000+'kbps';
			} else if (!isNaN(quality.width)){
				return quality.width+"x"+quality.height;
			} else {
				return index;
			}
		}


		ViblastQualityItem.prototype.handleClick = function(event) {

			if (this.options_.label === 'auto') {
				this.player_.viblast.abr = true;
			} else {
				this.player_.viblast['video'].quality = this.options_.quality;
			}
			this.player_.trigger("quality-changed", {
				data : this.options_.quality
			});
		};
		
		ViblastQualityItem.prototype.buildCSSClass = function() {
			return MenuItem.prototype.buildCSSClass.call(this) + ` viblast-quality-item`;
		}

		

		MenuItem.registerComponent('ViblastQualityItem', ViblastQualityItem);


		var MenuButton = videojs.getComponent('MenuButton');
		var ViblastQualityMenuButton = videojs.extend(MenuButton, {
			constructor : function(player, options) {
				MenuButton.call(this, player, options);
			}
		});

		ViblastQualityMenuButton.prototype.createItems = function() {
			var menuItems = [];
			for (var index in this.options_.qualities) {				
				menuItems.push(new ViblastQualityItem(
					this.player_,
					{
						customLabel: this.options_.customLabel,
						quality : this.options_.qualities[index],
						viblastQualityStreamtype:this.options_.viblastQualityStreamtype,
						index:(index+1),
					})
				);
			}

			menuItems.push(new ViblastQualityItem(
				this.player_,
				{
					customLabel: this.options_.customLabel,
					quality: "auto",
					viblastQualityStreamtype:this.options_.viblastQualityStreamtype,
					index:0,
					selected : true,
				})
			);
			return menuItems;
		};


		ViblastQualityMenuButton.prototype.buildCSSClass = function() {
			return MenuButton.prototype.buildCSSClass.call(this) + `viblast-quality-menu vjs-icon-cog`;
		}

		ViblastQualityMenuButton.prototype.controlText_ = 'Qualities';
		videojs.registerComponent('ViblastQualityMenuButton', ViblastQualityMenuButton);
		
		
		var ViblastQualityMenu = function(options) {

			var processQualities = function(player) {
				if (player.viblast['video'].qualities.length>1 && player.viblast['audio'].qualities.length<=1) {
					options.qualities = player.viblast['video'].qualities;
					options.viblastQualityStreamtype="video";
				} else if (player.viblast['video'].qualities.length<=1 && player.viblast['audio'].qualities.length>1) {
					options.qualities = player.viblast['audio'].qualities;
					options.viblastQualityStreamtype="audio";
				} else if (player.viblast['video'].qualities.length>1 && player.viblast['audio'].qualities.length>1) {
					// build more complex control;
					return;
				} else {
					return;
				}
				var menuButton = new ViblastQualityMenuButton(player, options);
				player.controlBar.el()
					.insertBefore(menuButton.el(), player.controlBar.fullscreenToggle.el());

			}
			
			this.on("ready", function() {

				if (this.viblast) {
					var player = this;
					//if Viblast already has the variant list fill the component
					if ((player.viblast.video && player.viblast.video.qualities) ||
							(player.viblast.audio && player.viblast.audio.qualities)) {
						processQualities(player);
					} else { //else wait until it is ready
						player.viblast.addEventListener('updatedmetadata', function(event) {
							processQualities(player);
						});
					}
				}
			  });
		};
		videojs.plugin('ViblastQualityMenu', ViblastQualityMenu);
	})(window, videojs);
})();