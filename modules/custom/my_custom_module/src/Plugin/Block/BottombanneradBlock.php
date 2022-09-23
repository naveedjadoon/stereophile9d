<?php

namespace Drupal\my_custom_module\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a bottombannerad block.
 *
 * @Block(
 *   id = "bottombannerad",
 *   admin_label = @Translation("bottombannerad"),
 *   category = @Translation("Custom")
 * )
 */
class BottombanneradBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [
      '#theme' => 'bottombannerad'
    ];
    return $build;
  }

}
