<?php

namespace Drupal\my_custom_module\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a bottomtwocolads block.
 *
 * @Block(
 *   id = "bottomtwocolads",
 *   admin_label = @Translation("bottomtwocolads"),
 *   category = @Translation("Custom")
 * )
 */
class BottomtwocoladsBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [
      '#theme' => 'bottomtwocolads'
    ];
    return $build;
  }

}
